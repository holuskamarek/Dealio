import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as entities from './entities';
import { SeedModule } from './database/seed.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { AuthModule } from './modules/auth/auth.module';
import { FollowsModule } from './modules/follows/follows.module';

@Module({
  imports: [
    // Načtení .env souboru
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeORM konfigurace s PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'dealio_user',
      password: process.env.DATABASE_PASSWORD || 'dealio_password',
      database: process.env.DATABASE_NAME || 'dealio_db',
      entities: [
        entities.User,
        entities.Business,
        entities.Promotion,
        entities.Event,
        entities.Redemption,
        entities.Follow,
      ],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      // TODO: Přidat SSL pro produkci
      // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    // Seed modul pro testovací data
    SeedModule,
    // Auth modul
    AuthModule,
    // API moduly
    BusinessesModule,
    PromotionsModule,
    FollowsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}