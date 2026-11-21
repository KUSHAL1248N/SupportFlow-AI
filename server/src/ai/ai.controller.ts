import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthUser } from '../common/auth.types';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { TicketsService } from '../tickets/tickets.service';
import { DraftReplyDto } from './dto/draft-reply.dto';
import { AiService } from './ai.service';

@ApiTags('AI assistance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai/tickets')
export class AiController {
  constructor(private readonly tickets: TicketsService, private readonly ai: AiService) {}

  @Post(':id/draft-reply') async draftReply(@Param('id') id: string, @Body() dto: DraftReplyDto, @Req() req: Request & { user: AuthUser }) {
    const ticket = await this.tickets.findAccessible(id, req.user.userId);
    return this.ai.draftReply(ticket, dto.tone || 'professional', dto.extraContext || '');
  }

  @Post(':id/summarize') async summarize(@Param('id') id: string, @Req() req: Request & { user: AuthUser }) {
    const ticket = await this.tickets.findAccessible(id, req.user.userId);
    return this.ai.summarize(ticket);
  }

  @Post(':id/classify') async classify(@Param('id') id: string, @Req() req: Request & { user: AuthUser }) {
    const ticket = await this.tickets.findAccessible(id, req.user.userId);
    const result = await this.ai.classify(ticket);
    await this.tickets.update(id, result, req.user.userId);
    return result;
  }
}
