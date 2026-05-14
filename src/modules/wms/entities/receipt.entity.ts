import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../auth/entities/user.entity';
import { Warehouse } from './warehouse.entity';

export type TReceiptStatus = 'PENDING_LOCATION' | 'LOCATED' | 'DISPATCHED';

@Entity('wms_receipt')
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'received_by' })
  receivedBy: User;

  @Column({ name: 'items', type: 'json' })
  items: {
    sku: string;
    description: string;
    quantity: number;
    unit: string;
    weight: number;
    volume: number;
  }[];

  @Column({ name: 'condition_notes', type: 'text', nullable: true })
  conditionNotes: string;

  @Column({ name: 'condition_photos', type: 'json', nullable: true })
  conditionPhotos: string[];

  @Column({ type: 'varchar', length: 20, default: 'PENDING_LOCATION' })
  status: TReceiptStatus;

  // Assigned location
  @Column({ name: 'rack_location', length: 50, nullable: true })
  rackLocation: string;

  @Column({ name: 'located_at', type: 'datetime', nullable: true })
  locatedAt: Date;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
