import {
  IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsArray, IsDateString
} from 'class-validator';
import type { TContainerType } from '../entities/container.entity';

export class CreateContainerDto {
  @IsString()
  @IsNotEmpty()
  containerNumber: string;

  @IsEnum(['20GP', '40GP', '40HC', '45HC', 'REEFER', 'TANK'])
  type: TContainerType;

  @IsNumber()
  @IsOptional()
  orderId?: number;

  @IsNumber()
  @IsOptional()
  ownerId?: number;
}

export class MoveContainerDto {
  @IsNumber()
  @IsNotEmpty()
  yardId: number;

  @IsString()
  @IsNotEmpty()
  zone: string;

  @IsNumber()
  @IsNotEmpty()
  row: number;

  @IsNumber()
  @IsNotEmpty()
  bay: number;

  @IsNumber()
  @IsNotEmpty()
  tier: number;
}

export class GateInDto {
  @IsString()
  @IsNotEmpty()
  containerNumber: string;

  @IsString()
  @IsNotEmpty()
  truckPlate: string;

  @IsString()
  @IsNotEmpty()
  driverName: string;

  @IsNumber()
  @IsOptional()
  inspectorId?: number;

  @IsArray()
  @IsOptional()
  conditionPhotos?: string[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  eventTime?: string;
}

export class GateOutDto {
  @IsString()
  @IsNotEmpty()
  containerNumber: string;

  @IsString()
  @IsNotEmpty()
  truckPlate: string;

  @IsString()
  @IsNotEmpty()
  driverName: string;

  @IsArray()
  @IsOptional()
  conditionPhotos?: string[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  eventTime?: string;
}
