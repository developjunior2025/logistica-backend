import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportService } from './services/transport.service';
import { TransportController } from './controllers/transport.controller';
import { Trip } from './entities/trip.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../auth/entities/user.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Order, User]), AuditModule],
  controllers: [TransportController],
  providers: [TransportService],
  exports: [TransportService],
})
export class TransportModule {}
