import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Đảm bảo thư mục uploads tồn tại
  const uploadsPath = join(process.cwd(), 'uploads');
  const avatarsPath = join(uploadsPath, 'avatars');
  const postersPath = join(uploadsPath, 'posters');

  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
  }
  if (!existsSync(avatarsPath)) {
    mkdirSync(avatarsPath, { recursive: true });
  }
  if (!existsSync(postersPath)) {
    mkdirSync(postersPath, { recursive: true });
  }

  // Serve static files - uploads folder
  // This serves files from uploads/ folder at /uploads/ URL path
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
    index: false,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable class-transformer to exclude sensitive fields
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Movie Booking API')
    .setDescription('API documentation for Movie Booking System')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('movies', 'Movie management endpoints')
    .addTag('cinemas', 'Cinema management endpoints')
    .addTag('schedules', 'Schedule management endpoints')
    .addTag('bookings', 'Booking management endpoints')
    .addTag('comments', 'Comment management endpoints')
    .addTag('blogs', 'Blog management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
  console.log(`Swagger documentation: http://0.0.0.0:${port}/api`);
  console.log(`Static files served from: ${uploadsPath}`);
}

bootstrap();
