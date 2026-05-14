import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Certificate } from './certificate.entity';

export type TPledgeStatus = 'PLEDGE_ACTIVE' | 'PLEDGE_SETTLED' | 'PLEDGE_EXPIRED';

@Entity('agd_pledge')
export class Pledge {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Certificate)
  @JoinColumn({ name: 'certificate_id' })
  certificate: Certificate;

  @Column({ name: 'financial_institution', length: 150 })
  financialInstitution: string;

  @Column({ name: 'credit_amount', type: 'decimal', precision: 12, scale: 2 })
  creditAmount: number;

  @Column({ name: 'interest_rate', type: 'decimal', precision: 5, scale: 2 })
  interestRate: number;

  @Column({ name: 'pledge_expires_at', type: 'datetime' })
  pledgeExpiresAt: Date;

  @Column({ type: 'varchar', length: 20, default: 'PLEDGE_ACTIVE' })
  status: TPledgeStatus;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;
}
