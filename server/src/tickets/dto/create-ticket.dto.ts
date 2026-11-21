import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TicketCategory } from '../schemas/ticket.schema';
export class CreateTicketDto {
  @IsString() @MinLength(4) @MaxLength(140) subject: string;
  @IsString() @MinLength(10) @MaxLength(5000) description: string;
  @IsOptional() @IsEnum(TicketCategory) category?: TicketCategory;
}
