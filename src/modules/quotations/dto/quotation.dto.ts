import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsDateString } from 'class-validator';

export class CreateQuotationDto {
  @IsNumber()
  @IsNotEmpty()
  storeId: number;

  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsOptional()
  originPortId?: number;

  @IsNumber()
  @IsOptional()
  destinationPortId?: number;

  @IsDateString()
  @IsOptional()
  requiredDate?: string;
}

export class RespondQuotationDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  proposedPrice: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  proposedDays?: number;

  @IsString()
  @IsOptional()
  storeComments?: string;
}

export class RejectQuotationDto {
  @IsString()
  @IsNotEmpty()
  clientComments: string;
}

export class RevisionQuotationDto {
  @IsString()
  @IsNotEmpty()
  clientComments: string;
}
