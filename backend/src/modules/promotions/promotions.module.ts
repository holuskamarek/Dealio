import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion, Business } from '../../entities';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, Business])],
  providers: [PromotionsService],
  controllers: [PromotionsController],
  exports: [PromotionsService],
})
export class PromotionsModule {}

