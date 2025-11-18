import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redemption } from '../../entities/redemption.entity';
import { Promotion } from '../../entities/promotion.entity';
import { User } from '../../entities/user.entity';
import { RedemptionsService } from './redemptions.service';
import { RedemptionsController } from './redemptions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Redemption, Promotion, User])],
  controllers: [RedemptionsController],
  providers: [RedemptionsService],
  exports: [RedemptionsService],
})
export class RedemptionsModule {}

