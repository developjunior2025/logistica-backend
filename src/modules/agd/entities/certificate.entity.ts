import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToOne,
} from 'typeorm';
import { Receipt } from '../../wms/entities/receipt.entity';
import { User } from '../../auth/entities/user.entity';

export type TCertificateStatus = 'CD_ACTIVE' | 'CD_PLEDGED' | 'CD_CANCELLED' | 'CD_EXPIRED';

@Entity('agd_certificate')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'folio', length: 50, unique: true })
  folio: string;

  @OneToOne(() => Receipt)
  @JoinColumn({ name: 'receipt_id' })
  receipt: Receipt;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'issued_by' })
  issuedBy: User;

  @Column({ name: 'declared_value', type: 'decimal', precision: 12, scale: 2 })
  declaredValue: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'issued_at', type: 'datetime' })
  issuedAt: Date;

  @Column({ name: 'expires_at', type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'varchar', length: 20, default: 'CD_ACTIVE' })
  status: TCertificateStatus;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
