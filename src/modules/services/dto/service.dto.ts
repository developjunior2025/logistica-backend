import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';

export class CreateStoreServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  serviceTypeId: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  estimatedDays?: number;
}

export class UpdateStoreServiceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  serviceTypeId?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  estimatedDays?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
