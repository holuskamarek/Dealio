import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Globální exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Globální validační pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS - povolí požadavky z admin webu a mobilní app
  app.enableCors({
    origin: true, // (pro vývoj)
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(` CrowdEase API běží na http://localhost:${port}`);
}

bootstrap();

