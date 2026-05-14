"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const quotations_service_1 = require("./services/quotations.service");
const quotations_controller_1 = require("./controllers/quotations.controller");
const quotation_entity_1 = require("./entities/quotation.entity");
const store_entity_1 = require("../stores/entities/store.entity");
const store_service_entity_1 = require("../stores/entities/store-service.entity");
const user_entity_1 = require("../auth/entities/user.entity");
let QuotationsModule = class QuotationsModule {
};
exports.QuotationsModule = QuotationsModule;
exports.QuotationsModule = QuotationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([quotation_entity_1.Quotation, store_entity_1.Store, store_service_entity_1.StoreService, user_entity_1.User])],
        controllers: [quotations_controller_1.QuotationsController],
        providers: [quotations_service_1.QuotationsService],
        exports: [quotations_service_1.QuotationsService]
    })
], QuotationsModule);
//# sourceMappingURL=quotations.module.js.map