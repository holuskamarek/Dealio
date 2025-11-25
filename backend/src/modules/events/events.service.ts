import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../entities/event.entity';
import { Promotion } from '../../entities/promotion.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
  ) {}

  /**
   * Vytvoří nový event (tracking)
   */
  async trackEvent(
    promotionId: string,
    type: 'view' | 'click' | 'redeem' | 'follow' | 'unfollow',
    userId?: string,
    metadata?: Record<string, any>,
  ): Promise<Event> {
    // Zkontroluj, jestli promotion existuje
    const promotion = await this.promotionRepository.findOne({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new NotFoundException('Akce nebyla nalezena');
    }

    // Vytvoř event
    const event = this.eventRepository.create({
      promotion_id: promotionId,
      user_id: userId || null,
      type,
      metadata: metadata || {},
    });

    return await this.eventRepository.save(event);
  }

  /**
   * Získá statistiky pro konkrétní akci
   */
  async getPromotionStats(promotionId: string) {
    // Zkontroluj, jestli promotion existuje
    const promotion = await this.promotionRepository.findOne({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new NotFoundException('Akce nebyla nalezena');
    }

    // Spočítej eventy podle typu
    const events = await this.eventRepository.find({
      where: { promotion_id: promotionId },
    });

    const stats = {
      total: events.length,
      views: events.filter((e) => e.type === 'view').length,
      clicks: events.filter((e) => e.type === 'click').length,
      redeems: events.filter((e) => e.type === 'redeem').length,
      follows: events.filter((e) => e.type === 'follow').length,
      unfollows: events.filter((e) => e.type === 'unfollow').length,
    };

    return stats;
  }

  /**
   * Získá statistiky pro všechny akce daného podniku
   * TODO: Optimalizovat pomocí SQL GROUP BY
   */
  async getBusinessStats(businessId: string) {
    // Najdi všechny akce podniku
    const promotions = await this.promotionRepository.find({
      where: { business_id: businessId },
    });

    if (promotions.length === 0) {
      return {
        total_promotions: 0,
        total_events: 0,
        total_views: 0,
        total_clicks: 0,
        total_redeems: 0,
      };
    }

    // Získej všechny eventy pro tyto akce
    const promotionIds = promotions.map((p) => p.id);
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.promotion_id IN (:...promotionIds)', { promotionIds })
      .getMany();

    const stats = {
      total_promotions: promotions.length,
      total_events: events.length,
      total_views: events.filter((e) => e.type === 'view').length,
      total_clicks: events.filter((e) => e.type === 'click').length,
      total_redeems: events.filter((e) => e.type === 'redeem').length,
      total_follows: events.filter((e) => e.type === 'follow').length,
      total_unfollows: events.filter((e) => e.type === 'unfollow').length,
    };

    return stats;
  }

  /**
   * Získá všechny eventy pro danou akci
   */
  async getPromotionEvents(promotionId: string): Promise<Event[]> {
    const promotion = await this.promotionRepository.findOne({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new NotFoundException('Akce nebyla nalezena');
    }

    return await this.eventRepository.find({
      where: { promotion_id: promotionId },
      order: { timestamp: 'DESC' },
      take: 100, // Limit na 100 posledních eventů
    });
  }
}

