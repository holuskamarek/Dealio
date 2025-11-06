import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion, Business, User } from '../../entities';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  /**
   * Vrátí seznam všech aktivních akcí
   * TODO: Přidat filtrování podle času (jen aktuální akce)
   * TODO: Přidat pagination
   */
  async findAll() {
    const promotions = await this.promotionRepository.find({
      where: { is_active: true },
      relations: ['business', 'events'],
      order: {
        start_datetime: 'DESC',
      },
    });

    return {
      success: true,
      data: promotions,
      count: promotions.length,
    };
  }

  /**
   * Vrátí detail jedné akce
   */
  async findById(id: string) {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['business', 'events', 'redemptions'],
    });

    if (!promotion) {
      throw new NotFoundException(`Akce s ID ${id} nebyla nalezena`);
    }

    return {
      success: true,
      data: promotion,
    };
  }

  /**
   * Vrátí akce pro konkrétní podnik
   */
  async findByBusinessId(businessId: string) {
    const promotions = await this.promotionRepository.find({
      where: { business_id: businessId },
      relations: ['business', 'events'],
      order: {
        start_datetime: 'DESC',
      },
    });

    return {
      success: true,
      data: promotions,
      count: promotions.length,
    };
  }

  /**
   * Vrátí aktuálně platné akce (v čase)
   * TODO: Implementovat filtrování podle času
   */
  async findActive() {
    const now = new Date();

    const promotions = await this.promotionRepository
      .createQueryBuilder('promotion')
      .where('promotion.is_active = :isActive', { isActive: true })
      .andWhere('promotion.start_datetime <= :now', { now })
      .andWhere('promotion.end_datetime >= :now', { now })
      .leftJoinAndSelect('promotion.business', 'business')
      .leftJoinAndSelect('promotion.events', 'events')
      .orderBy('promotion.start_datetime', 'DESC')
      .getMany();

    return {
      success: true,
      data: promotions,
      count: promotions.length,
    };
  }

  /**
   * Vytvoří novou akci
   */
  async create(data: any, user: User) {
    // Validace je nyní v DTO (CreatePromotionDto)
    if (!data.business_id || !data.title || !data.start_datetime || !data.end_datetime) {
      throw new BadRequestException('Chybí povinná pole: business_id, title, start_datetime, end_datetime');
    }

    // Zkontroluj, jestli podnik existuje a patří uživateli
    const business = await this.businessRepository.findOne({
      where: { id: data.business_id },
    });

    if (!business) {
      throw new NotFoundException(`Podnik s ID ${data.business_id} nebyl nalezen`);
    }

    if (business.owner_id !== user.id) {
      throw new ForbiddenException('Nemáš oprávnění vytvořit akci pro tento podnik');
    }

    try {
      const promotion = this.promotionRepository.create({
        business_id: data.business_id,
        title: data.title,
        description: data.description,
        discount_percent: data.discount_percent || 0,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
        target_hours: data.target_hours,
        limit: data.limit,
        is_active: data.is_active !== false, // Výchozí true
      });

      await this.promotionRepository.save(promotion);
      return {
        success: true,
        message: 'Akce byla úspěšně vytvořena',
        data: promotion,
      };
    } catch (error: any) {
      console.error('Chyba při vytváření akce:', error);
      throw new BadRequestException('Chyba při vytváření akce: ' + (error?.message || 'Neznámá chyba'));
    }
  }

  /**
   * Upraví existující akci
   * Jen vlastník podniku může upravit
   * TODO: Přidat DTO a validaci
   */
  async update(id: string, data: any, user: User) {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Akce s ID ${id} nebyla nalezena`);
    }

    // Zkontroluj, jestli je uživatel vlastník podniku
    const business = await this.businessRepository.findOne({
      where: { id: promotion.business_id },
    });

    if (!business) {
      throw new NotFoundException(`Podnik s ID ${promotion.business_id} nebyl nalezen`);
    }

    if (business.owner_id !== user.id) {
      throw new ForbiddenException('Nemáš oprávnění upravit tuto akci');
    }

    // Aktualizuj pole
    if (data.title) promotion.title = data.title;
    if (data.description) promotion.description = data.description;
    if (data.discount_percent !== undefined) promotion.discount_percent = data.discount_percent;
    if (data.start_datetime) promotion.start_datetime = new Date(data.start_datetime);
    if (data.end_datetime) promotion.end_datetime = new Date(data.end_datetime);
    if (data.target_hours) promotion.target_hours = data.target_hours;
    if (data.limit !== undefined) promotion.limit = data.limit;
    if (data.is_active !== undefined) promotion.is_active = data.is_active;

    await this.promotionRepository.save(promotion);

    return {
      success: true,
      message: 'Akce byla úspěšně aktualizována',
      data: promotion,
    };
  }

  /**
   * Smaže akci
   * Jen vlastník podniku může smazat
   */
  async delete(id: string, user: User) {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Akce s ID ${id} nebyla nalezena`);
    }

    // Zkontroluj, jestli je uživatel vlastník podniku
    const business = await this.businessRepository.findOne({
      where: { id: promotion.business_id },
    });

    if (!business) {
      throw new NotFoundException(`Podnik s ID ${promotion.business_id} nebyl nalezen`);
    }

    if (business.owner_id !== user.id) {
      throw new ForbiddenException('Nemáš oprávnění smazat tuto akci');
    }

    await this.promotionRepository.remove(promotion);

    return {
      success: true,
      message: 'Akce byla úspěšně smazána',
    };
  }
}

