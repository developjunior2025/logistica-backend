import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Currency } from '../../catalogs/entities/currency.entity';

export type TCommissionStatus = 'PENDING' | 'SETTLED';

@Entity('account_commission') // Custom Odoo adaptation for marketplace model
export class Commission {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Payment)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ name: 'base_amount', type: 'decimal', precision: 10, scale: 2 })
  baseAmount: number;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2 })
  commissionRate: number; // e.g., 5.00 for 5%

  @Column({ name: 'commission_amount', type: 'decimal', precision: 10, scale: 2 })
  commissionAmount: number;

  @Column({ name: 'net_store_payout', type: 'decimal', precision: 10, scale: 2 })
  netStorePayout: number;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'PENDING',
  })
  status: TCommissionStatus;

  @Column({ name: 'settlement_date', type: 'datetime', nullable: true })
  settlementDate: Date;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
