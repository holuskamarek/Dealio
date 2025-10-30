import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from '../database/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    await seedService.seed();
    console.log('✅ Seed skončil úspěšně');
  } catch (error) {
    console.error('❌ Chyba při seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

