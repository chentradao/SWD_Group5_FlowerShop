import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const allowedOrigins = ['http://localhost:5173','http://localhost:4173','https://fuhushu.onrender.com'];

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  app.useStaticAssets(resolve('uploads'), {
    prefix: '/uploads',
  });

  // Parse cookies so strategies that read req.cookies (e.g. cookie-based JWT) work
  app.use(cookieParser());

  // ✅ Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ✅ Swagger setup
  const config = new DocumentBuilder()
    .setTitle('FlowerShop API')
    .setDescription('API documentation for the multi-vendor flower shop platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT ?? 3212;
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`🌸 Swagger docs available at http://localhost:${PORT}/api`);
}
bootstrap();
