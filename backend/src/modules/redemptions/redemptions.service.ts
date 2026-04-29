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

    const user = await this.userRepository.findOne({
      where: { id: businessOwnerId },
    });

    if (!user || user.role !== 'business_owner') {
      throw new ForbiddenException('Pouze majitel podniku může ověřit PIN kód');
    }

    if (promotion.business.owner_id !== businessOwnerId) {
      throw new ForbiddenException('Tento PIN kód patří k akci jiného podniku');
    }

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

  async getStatsForOwner(ownerId: string) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const baseQuery = () =>
      this.redemptionRepository
        .createQueryBuilder('r')
        .innerJoin('r.promotion', 'p')
        .innerJoin('p.business', 'b')
        .where('b.owner_id = :ownerId', { ownerId })
        .andWhere('r.is_used = true');

    const totalRedemptions = await baseQuery().getCount();

    const todayRedemptions = await baseQuery()
      .andWhere('r.used_at >= :start', { start: startOfToday })
      .getCount();

    const activePromotions = await this.promotionRepository
      .createQueryBuilder('p')
      .innerJoin('p.business', 'b')
      .where('b.owner_id = :ownerId', { ownerId })
      .andWhere('p.is_active = true')
      .andWhere('p.start_datetime <= :now', { now })
      .andWhere('p.end_datetime >= :now', { now })
      .getCount();

    const lastWeek = await baseQuery()
      .andWhere('r.used_at >= :weekStart', { weekStart: sevenDaysAgo })
      .select("DATE(r.used_at)", 'day')
      .addSelect('COUNT(*)', 'count')
      .groupBy("DATE(r.used_at)")
      .getRawMany();

    const chart: { date: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const found = lastWeek.find((row) => {
        const rowDate = row.day instanceof Date ? row.day.toISOString().slice(0, 10) : String(row.day).slice(0, 10);
        return rowDate === key;
      });
      chart.push({ date: key, count: found ? Number(found.count) : 0 });
    }

    const recent = await this.redemptionRepository
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.promotion', 'p')
      .innerJoinAndSelect('p.business', 'b')
      .innerJoinAndSelect('r.user', 'u')
      .where('b.owner_id = :ownerId', { ownerId })
      .andWhere('r.is_used = true')
      .orderBy('r.used_at', 'DESC')
      .limit(5)
      .getMany();

    return {
      success: true,
      data: {
        total_redemptions: totalRedemptions,
        today_redemptions: todayRedemptions,
        active_promotions: activePromotions,
        last_7_days: chart,
        recent: recent.map((r) => ({
          id: r.id,
          used_at: r.used_at,
          user_name: r.user?.name,
          promotion_title: r.promotion?.title,
          business_name: r.promotion?.business?.name,
        })),
      },
    };
  }
}
