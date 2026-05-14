import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services/services.service';
import { ServicesController } from './controllers/services.controller';
import { StoreService } from '../stores/entities/store-service.entity';
import { Store } from '../stores/entities/store.entity';
import { ServiceType } from '../catalogs/entities/service-type.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreService, Store, ServiceType, User])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
