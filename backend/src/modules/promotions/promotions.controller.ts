import { Controller, Get, Param, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  /**
   * GET /promotions
   * Vrátí seznam všech aktivních akcí
   * Query parametry:
   * - active=true - vrátí jen aktuálně platné akce
   */
  @Get()
  async findAll(@Query('active') active?: string) {
    if (active === 'true') {
      return this.promotionsService.findActive();
    }
    return this.promotionsService.findAll();
  }

  /**
   * GET /promotions/:id
   * Vrátí detail jedné akce
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.promotionsService.findById(id);
  }

  // TODO: Přidat GET /promotions/business/:businessId (akce pro konkrétní podnik)
  // TODO: Přidat POST /promotions (vytvoření akce - pouze pro business_owner)
  // TODO: Přidat PUT /promotions/:id (úprava akce - pouze pro vlastníka)
  // TODO: Přidat DELETE /promotions/:id (smazání akce - pouze pro vlastníka)
}

