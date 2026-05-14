import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { AuditModule } from './modules/audit/audit.module';
import { CatalogsModule } from './modules/catalogs/catalogs.module';
import { StoresModule } from './modules/stores/stores.module';
import { ServicesModule } from './modules/services/services.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { TosModule } from './modules/tos/tos.module';
import { WmsModule } from './modules/wms/wms.module';
import { AgdModule } from './modules/agd/agd.module';
import { TransportModule } from './modules/transport/transport.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SupportModule } from './modules/support/support.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'marketplace_logistico',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    // ── Auth & Access Control ──────────────────────────────────
    AuthModule,
    RbacModule,
    AuditModule,
    // ── Catalogs (Puertos, Monedas, Tipos de Servicio) ─────────
    CatalogsModule,
    // ── Fase 1 & 2: Marketplace ────────────────────────────────
    StoresModule,
    ServicesModule,
    QuotationsModule,
    MarketplaceModule,
    // ── Fase 3: Operaciones & Finanzas (Sprints 09-11) ─────────
    OrdersModule,
    PaymentsModule,
    CommissionsModule,
    // ── Operaciones Portuarias (Sprints 12-17) ─────────────────
    TosModule,
    WmsModule,
    AgdModule,
    TransportModule,
    // ── Analytics & Soporte (Sprints 18-23) ───────────────────
    DashboardModule,
    ReportsModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
