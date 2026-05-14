import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('support_ticket_message')
export class TicketMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;
}
