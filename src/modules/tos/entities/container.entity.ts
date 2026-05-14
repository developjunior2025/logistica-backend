import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Yard } from './yard.entity';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../auth/entities/user.entity';

export type TContainerType = '20GP' | '40GP' | '40HC' | '45HC' | 'REEFER' | 'TANK';
export type TContainerStatus =
  | 'REGISTERED'
  | 'IN_YARD'
  | 'GATE_IN'
  | 'GATE_OUT'
  | 'IN_TRANSIT'
  | 'BLOCKED';

@Entity('tos_container')
@Index(['containerNumber'], { unique: true })
export class Container {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'container_number', length: 11 }) // ISO 6346 format: XXXX1234567
  containerNumber: string;

  @Column({ type: 'varchar', length: 10 })
  type: TContainerType;

  @Column({ type: 'varchar', length: 20, default: 'REGISTERED' })
  status: TContainerStatus;

  // Yard position
  @ManyToOne(() => Yard, { nullable: true })
  @JoinColumn({ name: 'yard_id' })
  yard: Yard;

  @Column({ length: 10, nullable: true })
  zone: string;

  @Column({ type: 'int', nullable: true })
  row: number;

  @Column({ type: 'int', nullable: true })
  bay: number;

  @Column({ type: 'int', nullable: true })
  tier: number;

  // Ownership / linking
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'is_blocked', default: false })
  isBlocked: boolean;

  @Column({ name: 'block_reason', type: 'text', nullable: true })
  blockReason: string;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
