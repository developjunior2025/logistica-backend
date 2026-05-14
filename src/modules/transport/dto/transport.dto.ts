import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateTripDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @IsNotEmpty()
  driverId: number;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  vehiclePlate: string;

  @IsString()
  @IsOptional()
  cargoType?: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledDate: string;
}

export class PodDto {
  @IsString()
  @IsOptional()
  podSignatureUrl?: string;

  @IsArray()
  @IsOptional()
  podPhotos?: string[];

  @IsString()
  @IsOptional()
  podNotes?: string;
}
