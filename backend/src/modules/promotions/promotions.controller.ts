import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  /**
   * POST /promotions
   * Vytvoří novou akci
   * Vyžaduje autentizaci
   * TODO: Přidat DTO a validaci
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: any, @Request() req: any) {
    return this.promotionsService.create(data, req.user);
  }

  /**
   * PUT /promotions/:id
   * Upraví existující akci
   * Jen vlastník podniku může upravit
   * TODO: Přidat DTO a validaci
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.promotionsService.update(id, data, req.user);
  }

  /**
   * DELETE /promotions/:id
   * Smaže akci
   * Jen vlastník podniku může smazat
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.promotionsService.delete(id, req.user);
  }

  // TODO: Přidat GET /promotions/business/:businessId (akce pro konkrétní podnik)
}

