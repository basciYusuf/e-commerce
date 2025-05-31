import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// import { seedCategories } from './categories/category.seed'; // Kaldırıldı
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // veya 5174
    credentials: true,
  });

  // app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  //   prefix: '/uploads/',
  // });

  // Seed kategorileri // Kaldırıldı
  // const dataSource = app.get(DataSource);
  // await seedCategories(dataSource);

  await app.listen(3000);
}

void bootstrap();
