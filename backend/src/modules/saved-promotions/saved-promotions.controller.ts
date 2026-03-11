import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SavedPromotionsService } from './saved-promotions.service';

@Controller('saved-promotions')
export class SavedPromotionsController {
  constructor(private savedPromotionsService: SavedPromotionsService) {}

  /**
   * POST /saved-promotions/:promotionId
   * Uložit akci
   */
  @Post(':promotionId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async savePromotion(
    @Param('promotionId') promotionId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const saved = await this.savedPromotionsService.savePromotion(userId, promotionId);

    return {
      success: true,
      message: 'Akce uložena',
      data: saved,
    };
  }

  /**
   * DELETE /saved-promotions/:promotionId
   * Odebrat uloženou akci
   */
  @Delete(':promotionId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unsavePromotion(
    @Param('promotionId') promotionId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    await this.savedPromotionsService.unsavePromotion(userId, promotionId);

    return {
      success: true,
      message: 'Akce odebrána z uložených',
    };
  }

  /**
   * GET /saved-promotions
   * Seznam uložených akcí
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getSavedPromotions(@Request() req: any) {
    const userId = req.user.id;
    const saved = await this.savedPromotionsService.getSavedPromotions(userId);

    return {
      success: true,
      data: saved,
      count: saved.length,
    };
  }

  /**
   * GET /saved-promotions/ids
   * Seznam ID uložených akcí 
   */
  @Get('ids')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getSavedPromotionIds(@Request() req: any) {
    const userId = req.user.id;
    const ids = await this.savedPromotionsService.getSavedPromotionIds(userId);

    return {
      success: true,
      data: ids,
    };
  }

  /**
   * GET /saved-promotions/:promotionId/is-saved
   * Zkontrolovat jestli je akce uložená
   */
  @Get(':promotionId/is-saved')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async isSaved(
    @Param('promotionId') promotionId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const isSaved = await this.savedPromotionsService.isSaved(userId, promotionId);

    return {
      success: true,
      data: { promotionId, isSaved },
    };
  }
}

