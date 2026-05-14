import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateReceiptDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @IsNotEmpty()
  warehouseId: number;

  @IsArray()
  @IsNotEmpty()
  items: {
    sku: string;
    description: string;
    quantity: number;
    unit: string;
    weight: number;
    volume: number;
  }[];

  @IsString()
  @IsOptional()
  conditionNotes?: string;

  @IsArray()
  @IsOptional()
  conditionPhotos?: string[];
}

export class LocateReceiptDto {
  @IsString()
  @IsNotEmpty()
  rackLocation: string;
}

export class CreateDispatchDto {
  @IsNumber()
  @IsNotEmpty()
  receiptId: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
