import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  /**
   * GET /businesses
   * Vrátí seznam všech podniků
   */
  @Get()
  async findAll() {
    return this.businessesService.findAll();
  }

  /**
   * GET /businesses/:id
   * Vrátí detail jednoho podniku
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.businessesService.findById(id);
  }

  /**
   * POST /businesses
   * Vytvoří nový podnik
   * Vyžaduje autentizaci
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: CreateBusinessDto, @Request() req: any) {
    return this.businessesService.create(data, req.user);
  }

  /**
   * PUT /businesses/:id
   * Upraví existující podnik
   * Jen vlastník může upravit
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateBusinessDto, @Request() req: any) {
    return this.businessesService.update(id, data, req.user);
  }

  /**
   * DELETE /businesses/:id
   * Smaže podnik
   * Jen vlastník může smazat
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.businessesService.delete(id, req.user);
  }
}

