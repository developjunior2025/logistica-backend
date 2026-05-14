import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { StoreService } from '../../stores/entities/store-service.entity';
import { User } from '../../auth/entities/user.entity';

export type TQuotationStatus = 
  | 'QUOTE_REQUESTED'
  | 'QUOTE_RESPONDED'
  | 'QUOTE_APPROVED'
  | 'QUOTE_REJECTED'
  | 'REVISION_REQUESTED';

@Entity('sale_order_quotation') // Odoo naming adaptation
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => StoreService)
  @JoinColumn({ name: 'service_id' })
  service: StoreService;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'origin_port_id', nullable: true })
  originPortId: number;

  @Column({ name: 'destination_port_id', nullable: true })
  destinationPortId: number;

  @Column({ name: 'required_date', type: 'date', nullable: true })
  requiredDate: Date;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'QUOTE_REQUESTED',
  })
  status: TQuotationStatus;

  // Fields updated by Store
  @Column({ name: 'proposed_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  proposedPrice: number;

  @Column({ name: 'proposed_days', type: 'int', nullable: true })
  proposedDays: number;

  @Column({ type: 'text', nullable: true })
  storeComments: string;

  // Fields updated by Client on reject/revision
  @Column({ type: 'text', nullable: true })
  clientComments: string;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
