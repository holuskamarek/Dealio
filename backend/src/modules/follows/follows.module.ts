import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from '../../entities/follow.entity';
import { Business } from '../../entities/business.entity';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, Business])],
  controllers: [FollowsController],
  providers: [FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}

