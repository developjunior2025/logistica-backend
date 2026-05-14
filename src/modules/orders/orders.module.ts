import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { Order } from './entities/order.entity';
import { User } from '../auth/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
// Import QuotationsModule later if needed to avoid circular dependency
import { QuotationsModule } from '../quotations/quotations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Store]),
    forwardRef(() => QuotationsModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
