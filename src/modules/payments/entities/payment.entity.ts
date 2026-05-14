import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../auth/entities/user.entity';
import { Currency } from '../../catalogs/entities/currency.entity';

export type TPaymentStatus = 'PENDING_VALIDATION' | 'VALIDATED' | 'REJECTED';

@Entity('account_payment') // Odoo naming adaptation
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'registered_by' })
  registeredBy: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({ name: 'receipt_url', length: 500 })
  receiptUrl: string;

  @Column({ name: 'reference_number', length: 100, nullable: true })
  referenceNumber: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'PENDING_VALIDATION',
  })
  status: TPaymentStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'validated_by' })
  validatedBy: User;

  @Column({ name: 'validation_date', type: 'datetime', nullable: true })
  validationDate: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
