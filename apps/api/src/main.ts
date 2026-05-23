// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Fix CORS — allow the frontend origin
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // ✅ Global ValidationPipe with transform (needed for @Transform decorators in DTOs)
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 4000);
  console.log(`🚀 API running on http://localhost:${process.env.PORT || 4000}/api`);
}
bootstrap();
