import { IsEnum, IsOptional } from 'class-validator';
import { TicketCategory, TicketPriority, TicketSentiment, TicketStatus } from '../schemas/ticket.schema';
export class UpdateTicketDto {
  @IsOptional() @IsEnum(TicketStatus) status?: TicketStatus;
  @IsOptional() @IsEnum(TicketPriority) priority?: TicketPriority;
  @IsOptional() @IsEnum(TicketCategory) category?: TicketCategory;
  @IsOptional() @IsEnum(TicketSentiment) sentiment?: TicketSentiment;
}
