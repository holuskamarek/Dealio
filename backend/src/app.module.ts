import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Načtení .env souboru
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TODO: Přidat TypeORM konfiguraci s databází
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: parseInt(process.env.DATABASE_PORT),
    //   username: process.env.DATABASE_USER,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME,
    //   entities: ['src/**/*.entity.ts'],
    //   synchronize: process.env.NODE_ENV === 'development',
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

