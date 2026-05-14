"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./modules/auth/auth.module");
const rbac_module_1 = require("./modules/rbac/rbac.module");
const catalogs_module_1 = require("./modules/catalogs/catalogs.module");
const stores_module_1 = require("./modules/stores/stores.module");
const services_module_1 = require("./modules/services/services.module");
const quotations_module_1 = require("./modules/quotations/quotations.module");
const orders_module_1 = require("./modules/orders/orders.module");
const payments_module_1 = require("./modules/payments/payments.module");
const commissions_module_1 = require("./modules/commissions/commissions.module");
const audit_module_1 = require("./modules/audit/audit.module");
const tos_module_1 = require("./modules/tos/tos.module");
const wms_module_1 = require("./modules/wms/wms.module");
const agd_module_1 = require("./modules/agd/agd.module");
const transport_module_1 = require("./modules/transport/transport.module");
const inspections_module_1 = require("./modules/inspections/inspections.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const reports_module_1 = require("./modules/reports/reports.module");
const support_module_1 = require("./modules/support/support.module");
const search_controller_1 = require("./modules/marketplace/search/search.controller");
const search_service_1 = require("./modules/marketplace/search/search.service");
const marketplace_module_1 = require("./modules/marketplace/marketplace.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '3306'),
                username: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'marketplace_logistico',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: process.env.NODE_ENV !== 'production',
                namingStrategy: undefined,
            }),
            auth_module_1.AuthModule,
            rbac_module_1.RbacModule,
            catalogs_module_1.CatalogsModule,
            stores_module_1.StoresModule,
            services_module_1.ServicesModule,
            quotations_module_1.QuotationsModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            commissions_module_1.CommissionsModule,
            audit_module_1.AuditModule,
            tos_module_1.TosModule,
            wms_module_1.WmsModule,
            agd_module_1.AgdModule,
            transport_module_1.TransportModule,
            inspections_module_1.InspectionsModule,
            dashboard_module_1.DashboardModule,
            reports_module_1.ReportsModule,
            support_module_1.SupportModule,
            marketplace_module_1.MarketplaceModule,
        ],
        controllers: [app_controller_1.AppController, search_controller_1.SearchController],
        providers: [app_service_1.AppService, search_service_1.SearchService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map