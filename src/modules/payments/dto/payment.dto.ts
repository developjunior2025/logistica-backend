import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class RegisterPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  currencyId: number;

  @IsString()
  @IsNotEmpty()
  receiptUrl: string;

  @IsString()
  @IsOptional()
  referenceNumber?: string;
}

export class RejectPaymentDto {
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}
