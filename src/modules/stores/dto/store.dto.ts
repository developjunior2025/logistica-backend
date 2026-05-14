import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  rfc?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  currencyId?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  portIds?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  serviceTypeIds?: number[];
}

export class UpdateStoreDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  rfc?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  currencyId?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  portIds?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  serviceTypeIds?: number[];
}
