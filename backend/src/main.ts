import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Globální validační pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // TODO: Přidat CORS konfiguraci pro mobilní app
  // TODO: Přidat rate limiting middleware
  // TODO: Přidat logging middleware

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Dealio API běží na http://localhost:${port}`);
}

bootstrap();

