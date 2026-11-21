import { Module } from '@nestjs/common';
import { TicketsModule } from '../tickets/tickets.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
@Module({ imports: [TicketsModule], controllers: [AiController], providers: [AiService] })
export class AiModule {}
