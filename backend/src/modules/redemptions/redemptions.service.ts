import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redemption } from '../../entities/redemption.entity';
import { Promotion } from '../../entities/promotion.entity';
import { User } from '../../entities/user.entity';

/**
 * RedemptionsService - služba pro správu uplatnění slev
 * 
 * TODO: Přidat expiraci PIN kódů (např. 15 minut)
 * TODO: Přidat rate limiting pro generování PIN kódů
 * FIXME: Přidat počet pokusů o uplatnění (max 3 pokusy)
 */
@Injectable()
export class RedemptionsService {
  constructor(
    @InjectRepository(Redemption)
    private redemptionRepository: Repository<Redemption>,
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Generovat náhodný 6-místný PIN kód
   * @returns PIN kód (např. "A3B7C9")
   */
  private generatePinCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Bez podobných znaků (0, O, 1, I)
    let pin = '';
    for (let i = 0; i < 6; i++) {
      pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
  }

  /**
   * Vytvořit redemption (uložit slevu pro uživatele)
   * @param userId - ID uživatele
   * @param promotionId - ID akce
   * @returns Nový Redemption s PIN kódem
   */
  async createRedemption(
    userId: string,
    promotionId: string,
  ): Promise<Redemption> {
    // Ověř, že akce existuje
    const promotion = await this.promotionRepository.findOne({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new NotFoundException(`Akce s ID ${promotionId} nebyla nalezena`);
    }

    // Zkontroluj, jestli akce ještě platí
    const now = new Date();
    if (promotion.end_datetime && new Date(promotion.end_datetime) < now) {
      throw new BadRequestException('Tato akce již vypršela');
    }

    // Zkontroluj, jestli uživatel už nemá aktivní redemption pro tuto akce
    const existingRedemption = await this.redemptionRepository.findOne({
      where: {
        user_id: userId,
        promotion_id: promotionId,
        is_used: false,
      },
    });

    if (existingRedemption) {
      throw new BadRequestException(
        'Již máš aktivní PIN kód pro tuto akci',
      );
    }

    // Generuj unikátní PIN kód
    let pinCode = this.generatePinCode();
    let attempts = 0;
    const maxAttempts = 10;

    // Zkontroluj, jestli PIN kód už neexistuje (velmi nepravděpodobné, ale možné)
    while (attempts < maxAttempts) {
      const existingPin = await this.redemptionRepository.findOne({
        where: { pin_code: pinCode },
      });

      if (!existingPin) {
        break;
      }

      pinCode = this.generatePinCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new BadRequestException(
        'Nepodařilo se vygenerovat unikátní PIN kód',
      );
    }

    // Vytvoř redemption
    const redemption = this.redemptionRepository.create({
      user_id: userId,
      promotion_id: promotionId,
      pin_code: pinCode,
      is_used: false,
    });

    return await this.redemptionRepository.save(redemption);
  }

  /**
   * Uplatnit slevu pomocí PIN kódu (pro podnik)
   * @param pinCode - PIN kód
   * @param businessOwnerId - ID vlastníka podniku (ověření)
   * @returns Uplatněný Redemption
   */
  async redeemByPin(
    pinCode: string,
    businessOwnerId: string,
  ): Promise<Redemption> {
    // Najdi redemption podle PIN kódu
    const redemption = await this.redemptionRepository.findOne({
      where: { pin_code: pinCode.toUpperCase() },
      relations: ['user'],
    });

    if (!redemption) {
      throw new NotFoundException('Neplatný PIN kód');
    }

    // Zkontroluj, jestli už byl použit
    if (redemption.is_used) {
      throw new BadRequestException('Tento PIN kód již byl použit');
    }

    // Načti promotion s business samostatně
    const promotion = await this.promotionRepository.findOne({
      where: { id: redemption.promotion_id },
      relations: ['business'],
    });

    if (!promotion) {
      throw new NotFoundException('Akce pro tento PIN kód nebyla nalezena');
    }

    if (!promotion.business) {
      throw new NotFoundException('Podnik pro tuto akci nebyl nalezen');
    }

    // Zkontroluj, jestli podnik patří tomuto vlastníkovi
    if (promotion.business.owner_id !== businessOwnerId) {
      throw new ForbiddenException(
        'Nemáš oprávnění uplatnit tento PIN kód',
      );
    }

    // Přidej promotion do redemption pro response
    redemption.promotion = promotion;

    // TODO: Zkontroluj expiraci PIN kódu

    // Označ jako použitý
    redemption.is_used = true;
    redemption.used_at = new Date();

    return await this.redemptionRepository.save(redemption);
  }

  /**
   * Získat redemptions uživatele
   * @param userId - ID uživatele
   * @returns Pole Redemption záznamů
   */
  async getUserRedemptions(userId: string): Promise<Redemption[]> {
    return await this.redemptionRepository.find({
      where: { user_id: userId },
      relations: ['promotion', 'promotion.business'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Získat aktivní (nepoužité) redemptions uživatele
   * @param userId - ID uživatele
   * @returns Pole aktivních Redemption záznamů
   */
  async getActiveRedemptions(userId: string): Promise<Redemption[]> {
    return await this.redemptionRepository.find({
      where: { user_id: userId, is_used: false },
      relations: ['promotion', 'promotion.business'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Získat detail redemption podle ID
   * @param redemptionId - ID redemption
   * @param userId - ID uživatele (ověření vlastnictví)
   * @returns Redemption
   */
  async getRedemptionById(
    redemptionId: string,
    userId: string,
  ): Promise<Redemption> {
    const redemption = await this.redemptionRepository.findOne({
      where: { id: redemptionId },
      relations: ['promotion', 'promotion.business'],
    });

    if (!redemption) {
      throw new NotFoundException('Redemption nebyl nalezen');
    }

    if (redemption.user_id !== userId) {
      throw new ForbiddenException('Nemáš oprávnění zobrazit tento redemption');
    }

    return redemption;
  }
}
