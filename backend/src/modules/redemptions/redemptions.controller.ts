import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RedemptionsService } from './redemptions.service';

/**
 * RedemptionsController - API endpointy pro uplatnění slev
 *
 * TODO: Přidat endpoint pro statistiky redemptions
 * TODO: Přidat endpoint pro historii redemptions podniku
 */
@Controller('redemptions')
@UseGuards(ThrottlerGuard)
export class RedemptionsController {
  constructor(private redemptionsService: RedemptionsService) {}

  /**
   * POST /redemptions/promotions/:promotionId
   * Vytvořit redemption (uložit slevu) pro akci
   * Rate limit: 10 za minutu (ochrana proti zneužití)
   */
  @Post('promotions/:promotionId')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 PIN kódů za minutu
  @HttpCode(HttpStatus.CREATED)
  async createRedemption(
    @Param('promotionId') promotionId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const redemption = await this.redemptionsService.createRedemption(
      userId,
      promotionId,
    );

    return {
      success: true,
      message: 'Sleva byla uložena! Ukaž PIN kód v podniku.',
      data: {
        id: redemption.id,
        pin_code: redemption.pin_code,
        promotion_id: redemption.promotion_id,
        created_at: redemption.created_at,
      },
    };
  }

  /**
   * POST /redemptions/redeem
   * Uplatnit slevu pomocí PIN kódu (pro podnik)
   * Rate limit: 20 za minutu (ochrana proti brute-force PIN hádání)
   */
  @Post('redeem')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 pokusů za minutu
  @HttpCode(HttpStatus.OK)
  async redeemByPin(@Body('pin_code') pinCode: string, @Request() req: any) {
    const businessOwnerId = req.user.id;
    const redemption = await this.redemptionsService.redeemByPin(
      pinCode,
      businessOwnerId,
    );

    return {
      success: true,
      message: 'Sleva byla úspěšně uplatněna!',
      data: {
        id: redemption.id,
        pin_code: redemption.pin_code,
        used_at: redemption.used_at,
        user: redemption.user
          ? {
              id: redemption.user.id,
              name: redemption.user.name,
              email: redemption.user.email,
            }
          : null,
        promotion: redemption.promotion
          ? {
              id: redemption.promotion.id,
              title: redemption.promotion.title,
              description: redemption.promotion.description,
            }
          : null,
      },
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getStats(@Request() req: any) {
    return this.redemptionsService.getStatsForOwner(req.user.id);
  }

  /**
   * GET /redemptions/me
   * Získat všechny redemptions aktuálního uživatele
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMyRedemptions(@Request() req: any) {
    const userId = req.user.id;
    const redemptions = await this.redemptionsService.getUserRedemptions(
      userId,
    );

    return {
      success: true,
      message: 'Tvoje uložené slevy',
      data: redemptions,
      count: redemptions.length,
    };
  }

  /**
   * GET /redemptions/me/active
   * Získat aktivní (nepoužité) redemptions aktuálního uživatele
   */
  @Get('me/active')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMyActiveRedemptions(@Request() req: any) {
    const userId = req.user.id;
    const redemptions = await this.redemptionsService.getActiveRedemptions(
      userId,
    );

    return {
      success: true,
      message: 'Tvoje aktivní slevy',
      data: redemptions,
      count: redemptions.length,
    };
  }

  /**
   * GET /redemptions/:id
   * Získat detail redemption
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getRedemptionById(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    const redemption = await this.redemptionsService.getRedemptionById(
      id,
      userId,
    );

    return {
      success: true,
      message: 'Detail redemption',
      data: redemption,
    };
  }
}

