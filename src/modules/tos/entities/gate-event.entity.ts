import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Container } from './container.entity';
import { User } from '../../auth/entities/user.entity';

export type TGateEventType = 'GATE_IN' | 'GATE_OUT';

@Entity('tos_gate_event')
export class GateEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Container)
  @JoinColumn({ name: 'container_id' })
  container: Container;

  @Column({ type: 'varchar', length: 10 })
  type: TGateEventType;

  @Column({ name: 'truck_plate', length: 20 })
  truckPlate: string;

  @Column({ name: 'driver_name', length: 100 })
  driverName: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'inspector_id' })
  inspector: User;

  @Column({ name: 'condition_photos', type: 'json', nullable: true })
  conditionPhotos: string[]; // Array of photo URLs

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'event_time', type: 'datetime' })
  eventTime: Date;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;
}
