import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * POST /events/track
   * Zaznamenat event (view, click, follow, redeem)
   * Volitelně s autentizací (pokud je uživatel přihlášen)
   */
  @Post('track')
  @HttpCode(HttpStatus.CREATED)
  async trackEvent(
    @Body('promotion_id') promotionId: string,
    @Body('type') type: 'view' | 'click' | 'redeem' | 'follow' | 'unfollow',
    @Body('metadata') metadata?: Record<string, any>,
    @Request() req?: any,
  ) {
    // Pokud je uživatel přihlášen, použij jeho ID
    const userId = req?.user?.id || null;

    const event = await this.eventsService.trackEvent(
      promotionId,
      type,
      userId,
      metadata,
    );

    return {
      success: true,
      message: 'Event byl zaznamenán',
      data: {
        id: event.id,
        type: event.type,
        timestamp: event.timestamp,
      },
    };
  }

  /**
   * GET /events/promotions/:id/stats
   * Získat statistiky pro konkrétní akci
   */
  @Get('promotions/:id/stats')
  @UseGuards(JwtAuthGuard)
  async getPromotionStats(@Param('id') promotionId: string) {
    const stats = await this.eventsService.getPromotionStats(promotionId);

    return {
      success: true,
      message: 'Statistiky akce',
      data: stats,
    };
  }

  /**
   * GET /events/businesses/:id/stats
   * Získat statistiky pro všechny akce daného podniku
   */
  @Get('businesses/:id/stats')
  @UseGuards(JwtAuthGuard)
  async getBusinessStats(@Param('id') businessId: string) {
    const stats = await this.eventsService.getBusinessStats(businessId);

    return {
      success: true,
      message: 'Statistiky podniku',
      data: stats,
    };
  }

  /**
   * GET /events/promotions/:id
   * Získat všechny eventy pro danou akci (pro debug)
   */
  @Get('promotions/:id')
  @UseGuards(JwtAuthGuard)
  async getPromotionEvents(@Param('id') promotionId: string) {
    const events = await this.eventsService.getPromotionEvents(promotionId);

    return {
      success: true,
      message: 'Eventy akce',
      data: events,
      count: events.length,
    };
  }
}

