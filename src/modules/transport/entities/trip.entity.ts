import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../auth/entities/user.entity';

export type TTripStatus = 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

@Entity('transport_trip')
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ length: 100 })
  origin: string;

  @Column({ length: 100 })
  destination: string;

  @Column({ name: 'vehicle_plate', length: 20 })
  vehiclePlate: string;

  @Column({ name: 'cargo_type', length: 100, nullable: true })
  cargoType: string;

  @Column({ name: 'scheduled_date', type: 'datetime' })
  scheduledDate: Date;

  @Column({ name: 'started_at', type: 'datetime', nullable: true })
  startedAt: Date;

  @Column({ name: 'delivered_at', type: 'datetime', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'varchar', length: 20, default: 'SCHEDULED' })
  status: TTripStatus;

  // POD — Proof of Delivery
  @Column({ name: 'pod_signature_url', length: 500, nullable: true })
  podSignatureUrl: string;

  @Column({ name: 'pod_photos', type: 'json', nullable: true })
  podPhotos: string[];

  @Column({ name: 'pod_notes', type: 'text', nullable: true })
  podNotes: string;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
