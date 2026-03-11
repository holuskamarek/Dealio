import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedPromotion } from '../../entities/saved-promotion.entity';
import { Promotion } from '../../entities/promotion.entity';
import { SavedPromotionsService } from './saved-promotions.service';
import { SavedPromotionsController } from './saved-promotions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SavedPromotion, Promotion])],
  controllers: [SavedPromotionsController],
  providers: [SavedPromotionsService],
  exports: [SavedPromotionsService],
})
export class SavedPromotionsModule {}

