import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TicketMessage } from '../entities/ticket-message.entity';
import { User } from '../../auth/entities/user.entity';
import { CreateTicketDto, CreateMessageDto } from '../dto/support.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketMessage) private readonly messageRepo: Repository<TicketMessage>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createTicket(dto: CreateTicketDto, userId: number) {
    const creator = await this.userRepo.findOne({ where: { id: userId } });
    if (!creator) throw new NotFoundException('User not found');

    const ticket = this.ticketRepo.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      priority: dto.priority || 'LOW',
      referenceId: dto.referenceId,
      attachments: dto.attachments,
      creator,
    });

    return this.ticketRepo.save(ticket);
  }

  async assignTicket(ticketId: number, assigneeId: number) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const assignee = await this.userRepo.findOne({ where: { id: assigneeId } });
    if (!assignee) throw new NotFoundException('Assignee not found');

    ticket.assignee = assignee;
    ticket.status = 'ASSIGNED';

    return this.ticketRepo.save(ticket);
  }

  async addMessage(ticketId: number, dto: CreateMessageDto, userId: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['creator', 'assignee'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const sender = await this.userRepo.findOne({ where: { id: userId } });
    if (!sender) throw new NotFoundException('User not found');

    // Only creator, assignee or superadmin (checked via roles/guard in controller if needed) can reply.
    // Assuming controller handles broad access, we can allow it here or add strict checks.

    const msg = this.messageRepo.create({
      ticket,
      sender,
      message: dto.message,
      attachments: dto.attachments,
    });

    return this.messageRepo.save(msg);
  }

  async findMyTickets(userId: number) {
    return this.ticketRepo.find({
      where: { creator: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllTickets() {
    return this.ticketRepo.find({
      relations: ['creator', 'assignee'],
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  async getTicketDetails(ticketId: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['creator', 'assignee'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const messages = await this.messageRepo.find({
      where: { ticket: { id: ticketId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });

    return { ticket, messages };
  }
}
