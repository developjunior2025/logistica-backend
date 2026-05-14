import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateCertificateDto {
  @IsNumber()
  @IsNotEmpty()
  receiptId: number;

  @IsNumber()
  @IsNotEmpty()
  declaredValue: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  expiresAt: string;
}

export class CreatePledgeDto {
  @IsString()
  @IsNotEmpty()
  financialInstitution: string;

  @IsNumber()
  @IsNotEmpty()
  creditAmount: number;

  @IsNumber()
  @IsNotEmpty()
  interestRate: number;

  @IsDateString()
  @IsNotEmpty()
  pledgeExpiresAt: string;
}
