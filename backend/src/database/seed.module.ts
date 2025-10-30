import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User, Business, Promotion, Event } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Business, Promotion, Event])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

