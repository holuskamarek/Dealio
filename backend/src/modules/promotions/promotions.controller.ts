import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePromotionDto, UpdatePromotionDto } from './dto';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}


  @Get()
  async findAll(@Query('active') active?: string) {
    if (active === 'true') {
      return this.promotionsService.findActive();
    }
    return this.promotionsService.findAll();
  }

 
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMy(@Request() req: any) {
    return this.promotionsService.findByOwner(req.user.id);
  }

  @Get('business/:businessId')
  async findByBusiness(@Param('businessId') businessId: string) {
    return this.promotionsService.findByBusinessId(businessId);
  }


  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.promotionsService.findById(id);
  }


  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: CreatePromotionDto, @Request() req: any) {
    return this.promotionsService.create(data, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdatePromotionDto, @Request() req: any) {
    return this.promotionsService.update(id, data, req.user);
  }

 
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.promotionsService.delete(id, req.user);
  }

}

