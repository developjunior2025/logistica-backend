import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/reports.controller';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Commission } from '../commissions/entities/commission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Payment, Commission])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
