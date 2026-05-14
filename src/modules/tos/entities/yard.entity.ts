import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Port } from '../../catalogs/entities/port.entity';

@Entity('tos_yard')
export class Yard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Port)
  @JoinColumn({ name: 'port_id' })
  port: Port;

  @Column({ name: 'total_capacity', type: 'int' })
  totalCapacity: number;

  @Column({ name: 'zone_count', type: 'int', default: 1 })
  zoneCount: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
