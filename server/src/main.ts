import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be set to a random value of at least 32 characters in production');
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI must be configured in production');
  }
  const app = await NestFactory.create(AppModule, { cors: false });
  app.setGlobalPrefix('api');
  app.use(helmet());
  const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((v) => v.trim());
  app.enableCors({ origin: origins, credentials: true, methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  const swagger = new DocumentBuilder().setTitle(process.env.APP_TITLE || 'API').setDescription('REST API documentation').setVersion('1.0').addBearerAuth().build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));
  const port = Number(process.env.PORT || 4002);
  await app.listen(port, '0.0.0.0');
  console.log(`API listening on http://localhost:${port}/api`);
}
void bootstrap();
