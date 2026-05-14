import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TosService } from './services/tos.service';
import { TosController } from './controllers/tos.controller';
import { Container } from './entities/container.entity';
import { Yard } from './entities/yard.entity';
import { GateEvent } from './entities/gate-event.entity';
import { User } from '../auth/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Container, Yard, GateEvent, User, Order]),
    AuditModule,
  ],
  controllers: [TosController],
  providers: [TosService],
  exports: [TosService],
})
export class TosModule {}
