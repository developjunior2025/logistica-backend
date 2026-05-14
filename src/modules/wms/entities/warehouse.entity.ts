import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Port } from '../../catalogs/entities/port.entity';

@Entity('wms_warehouse')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Port)
  @JoinColumn({ name: 'port_id' })
  port: Port;

  @Column({ length: 200, nullable: true })
  address: string;

  @Column({ name: 'total_positions', type: 'int', default: 0 })
  totalPositions: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
