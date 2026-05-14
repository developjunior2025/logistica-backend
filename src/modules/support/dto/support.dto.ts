import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsArray } from 'class-validator';
import type { TTicketCategory, TTicketPriority } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['PAYMENT', 'QUOTATION', 'ORDER', 'TECHNICAL', 'OTHER'])
  category: TTicketCategory;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  @IsOptional()
  priority?: TTicketPriority;

  @IsNumber()
  @IsOptional()
  referenceId?: number;

  @IsArray()
  @IsOptional()
  attachments?: string[];
}

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsArray()
  @IsOptional()
  attachments?: string[];
}
