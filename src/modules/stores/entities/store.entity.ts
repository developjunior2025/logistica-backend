import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Port } from '../../catalogs/entities/port.entity';
import { ServiceType } from '../../catalogs/entities/service-type.entity';
import { Currency } from '../../catalogs/entities/currency.entity';

export type TStoreStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

@Entity('res_partner') // Odoo base table
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 50, nullable: true })
  rfc: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ name: 'logo_url', length: 500, nullable: true })
  logoUrl: string;

  @Column({ name: 'cover_url', length: 500, nullable: true })
  coverUrl: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'PENDING_APPROVAL',
  })
  status: TStoreStatus;

  @Column({ name: 'rating_avg', type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAvg: number;

  @Column({ name: 'rating_count', type: 'int', default: 0 })
  ratingCount: number;

  @Column({ name: 'price_from', type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceFrom: number;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToMany(() => Port)
  @JoinTable({
    name: 'logistics_store_port',
    joinColumn: { name: 'store_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'port_id', referencedColumnName: 'id' },
  })
  ports: Port[];

  @ManyToMany(() => ServiceType)
  @JoinTable({
    name: 'logistics_store_service_type', // Custom pivot
    joinColumn: { name: 'store_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_type_id', referencedColumnName: 'id' },
  })
  serviceTypes: ServiceType[];

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
