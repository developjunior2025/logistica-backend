import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportService } from './services/support.service';
import { SupportController } from './controllers/support.controller';
import { Ticket } from './entities/ticket.entity';
import { TicketMessage } from './entities/ticket-message.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketMessage, User])],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
