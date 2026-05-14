"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const typeorm_1 = require("typeorm");
const store_entity_1 = require("./store.entity");
const service_type_entity_1 = require("../../catalogs/entities/service-type.entity");
let StoreService = class StoreService {
    id;
    name;
    description;
    price;
    store;
    serviceType;
    estimatedDays;
    active;
    createdAt;
    updatedAt;
};
exports.StoreService = StoreService;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StoreService.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], StoreService.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], StoreService.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'list_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], StoreService.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], StoreService.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_type_entity_1.ServiceType),
    (0, typeorm_1.JoinColumn)({ name: 'service_type_id' }),
    __metadata("design:type", service_type_entity_1.ServiceType)
], StoreService.prototype, "serviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_days', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], StoreService.prototype, "estimatedDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], StoreService.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_date' }),
    __metadata("design:type", Date)
], StoreService.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'write_date' }),
    __metadata("design:type", Date)
], StoreService.prototype, "updatedAt", void 0);
exports.StoreService = StoreService = __decorate([
    (0, typeorm_1.Entity)('product_template')
], StoreService);
//# sourceMappingURL=store-service.entity.js.map