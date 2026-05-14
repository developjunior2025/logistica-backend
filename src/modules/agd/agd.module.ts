import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgdService } from './services/agd.service';
import { AgdController } from './controllers/agd.controller';
import { Certificate } from './entities/certificate.entity';
import { Pledge } from './entities/pledge.entity';
import { Receipt } from '../wms/entities/receipt.entity';
import { User } from '../auth/entities/user.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Pledge, Receipt, User]), AuditModule],
  controllers: [AgdController],
  providers: [AgdService],
  exports: [AgdService],
})
export class AgdModule {}
