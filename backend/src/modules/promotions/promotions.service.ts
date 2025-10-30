import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from '../../entities';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
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
}

