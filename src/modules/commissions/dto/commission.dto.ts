import { IsNumber, Min } from 'class-validator';

export class UpdateCommissionConfigDto {
  // Config would usually go to a different table.
  // For simplicity we might just do global config or specific config.
  // This is a placeholder for the actual rule configuration (Sprint 11).
  @IsNumber()
  @Min(0)
  defaultRate: number;
}
