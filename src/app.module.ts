import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { CatalogsModule } from './modules/catalogs/catalogs.module';
import { StoresModule } from './modules/stores/stores.module';
import { ServicesModule } from './modules/services/services.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { AuditModule } from './modules/audit/audit.module';
import { TosModule } from './modules/tos/tos.module';
import { WmsModule } from './modules/wms/wms.module';
import { AgdModule } from './modules/agd/agd.module';
import { TransportModule } from './modules/transport/transport.module';
import { InspectionsModule } from './modules/inspections/inspections.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SupportModule } from './modules/support/support.module';
import { SearchController } from './modules/marketplace/search/search.controller';
import { SearchService } from './modules/marketplace/search/search.service';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'marketplace_logistico',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Use migrations in production
      namingStrategy: undefined, // Custom naming strategy will go here if needed
    }),
    AuthModule,
    RbacModule,
    CatalogsModule,
    StoresModule,
    ServicesModule,
    QuotationsModule,
    OrdersModule,
    PaymentsModule,
    CommissionsModule,
    AuditModule,
    TosModule,
    WmsModule,
    AgdModule,
    TransportModule,
    InspectionsModule,
    DashboardModule,
    ReportsModule,
    SupportModule,
    MarketplaceModule,
    // Modules will be imported here
  ],
  controllers: [AppController, SearchController],
  providers: [AppService, SearchService],
})
export class AppModule {}
