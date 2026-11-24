import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be set to a random value of at least 32 characters in production');
    }
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI must be configured in production');
    }
  }

  const app = await NestFactory.create(AppModule, { cors: false });
  app.setGlobalPrefix('api');
  app.use(helmet());

  // The deployed React app and API share one origin. This also permits
  // localhost during local development if CORS_ORIGIN is not overridden.
  const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((value) => value.trim());
  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swagger = new DocumentBuilder()
    .setTitle(process.env.APP_TITLE || 'API')
    .setDescription('REST API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));

  // In the single-container deployment, serve the Vite build from the same
  // Node/NestJS process. API and Swagger requests continue to NestJS routes;
  // other GET paths fall back to index.html for React Router deep links.
  const clientDistPath = join(__dirname, '..', 'client-dist');
  if (process.env.NODE_ENV === 'production' && existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.use((req, res, next) => {
      const isApiRequest = req.path === '/api' || req.path.startsWith('/api/');
      const isDocsRequest =
        req.path === '/docs' ||
        req.path.startsWith('/docs/') ||
        req.path === '/docs-json';

      if (req.method !== 'GET' || isApiRequest || isDocsRequest) {
        return next();
      }
      return res.sendFile(join(clientDistPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT || 4002);
  await app.listen(port, '0.0.0.0');
  console.log(`SupportFlow AI listening on port ${port}`);
}

void bootstrap();
