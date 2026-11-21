import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthUser } from '../common/auth.types';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';

@ApiTags('tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}
  @Get('summary') summary(@Req() req: Request & { user: AuthUser }) { return this.tickets.summary(req.user.userId); }
  @Get() list(@Req() req: Request & { user: AuthUser }, @Query('status') status?: string, @Query('priority') priority?: string, @Query('search') search?: string) { return this.tickets.list(req.user.userId, { status, priority, search }); }
  @Post() create(@Body() dto: CreateTicketDto, @Req() req: Request & { user: AuthUser }) { return this.tickets.create(dto, req.user); }
  @Get(':id') get(@Param('id') id: string, @Req() req: Request & { user: AuthUser }) { return this.tickets.findAccessible(id, req.user.userId); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateTicketDto, @Req() req: Request & { user: AuthUser }) { return this.tickets.update(id, dto, req.user.userId); }
  @Post(':id/replies') reply(@Param('id') id: string, @Body() dto: ReplyTicketDto, @Req() req: Request & { user: AuthUser }) { return this.tickets.addReply(id, dto.body, req.user); }
}
