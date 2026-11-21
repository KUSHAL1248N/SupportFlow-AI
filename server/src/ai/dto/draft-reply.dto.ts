import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
export class DraftReplyDto {
  @IsOptional() @IsIn(['professional', 'friendly', 'concise']) tone?: 'professional' | 'friendly' | 'concise';
  @IsOptional() @IsString() @MaxLength(500) extraContext?: string;
}
