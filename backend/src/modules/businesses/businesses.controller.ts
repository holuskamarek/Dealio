import { Controller, Get, Param } from '@nestjs/common';
import { BusinessesService } from './businesses.service';

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

  // TODO: Přidat POST /businesses (vytvoření podniku - pouze pro business_owner)
  // TODO: Přidat PUT /businesses/:id (úprava podniku - pouze pro vlastníka)
  // TODO: Přidat DELETE /businesses/:id (smazání podniku - pouze pro vlastníka)
}

