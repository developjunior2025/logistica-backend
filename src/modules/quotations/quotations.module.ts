import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsService } from './services/quotations.service';
import { QuotationsController } from './controllers/quotations.controller';
import { Quotation } from './entities/quotation.entity';
import { Store } from '../stores/entities/store.entity';
import { StoreService } from '../stores/entities/store-service.entity';
import { User } from '../auth/entities/user.entity';
import { OrdersModule } from '../orders/orders.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quotation, Store, StoreService, User]),
    forwardRef(() => OrdersModule),
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService]
})
export class QuotationsModule {}
