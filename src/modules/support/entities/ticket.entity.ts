import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export type TTicketStatus = 'OPEN' | 'ASSIGNED' | 'RESOLVED' | 'CLOSED';
export type TTicketCategory = 'PAYMENT' | 'QUOTATION' | 'ORDER' | 'TECHNICAL' | 'OTHER';
export type TTicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

@Entity('support_ticket')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  category: TTicketCategory;

  @Column({ type: 'varchar', length: 15, default: 'LOW' })
  priority: TTicketPriority;

  @Column({ type: 'varchar', length: 20, default: 'OPEN' })
  status: TTicketStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: number; // Could be orderId or quotationId depending on category

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
