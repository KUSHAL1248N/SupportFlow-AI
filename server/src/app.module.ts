import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { CommonModule } from './common/common.module';
import { TicketsModule } from './tickets/tickets.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supportflow_ai'),
    CommonModule,
    AuthModule,
    HealthModule,
    TicketsModule,
    AiModule,
  ],
})
export class AppModule {}
