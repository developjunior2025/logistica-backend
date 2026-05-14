import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresService } from './services/stores.service';
import { StoresController } from './controllers/stores.controller';
import { Store } from './entities/store.entity';
import { StoreService } from './entities/store-service.entity';
import { Port } from '../catalogs/entities/port.entity';
import { ServiceType } from '../catalogs/entities/service-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StoreService, Port, ServiceType])],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService]
})
export class StoresModule {}
