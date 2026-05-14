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
import { User } from '../../auth/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { StoreService } from '../../stores/entities/store-service.entity';
import { Quotation } from '../../quotations/entities/quotation.entity';
import { Currency } from '../../catalogs/entities/currency.entity';

export type TOrderStatus = 
  | 'ORDER_CREATED'
  | 'ORDER_CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

@Entity('sale_order') // Odoo base table for orders
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Quotation)
  @JoinColumn({ name: 'quotation_id' })
  quotation: Quotation;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => StoreService)
  @JoinColumn({ name: 'service_id' })
  service: StoreService;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'ORDER_CREATED',
  })
  status: TOrderStatus;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
