import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type TAuditLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TAuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATE_CHANGE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'GATE_IN'
  | 'GATE_OUT'
  | 'PAYMENT_VALIDATED'
  | 'CERTIFICATE_ISSUED'
  | 'PLEDGE_CREATED'
  | 'BLOCK_SET'
  | 'BLOCK_RELEASED';

@Entity('audit_logs')
@Index(['userId'])
@Index(['entityType', 'entityId'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'user_role', length: 30, nullable: true })
  userRole: string;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'entity_type', length: 100 })
  entityType: string;

  @Column({ name: 'entity_id', nullable: true })
  entityId: number;

  @Column({ type: 'varchar', length: 50 })
  action: TAuditAction;

  @Column({ type: 'varchar', length: 10, default: 'LOW' })
  level: TAuditLevel;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'previous_value', type: 'json', nullable: true })
  previousValue: object;

  @Column({ name: 'new_value', type: 'json', nullable: true })
  newValue: object;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;
}
