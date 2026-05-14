import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WmsService } from './services/wms.service';
import { WmsController } from './controllers/wms.controller';
import { Receipt } from './entities/receipt.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../auth/entities/user.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt, Warehouse, Order, User]), AuditModule],
  controllers: [WmsController],
  providers: [WmsService],
  exports: [WmsService],
})
export class WmsModule {}
