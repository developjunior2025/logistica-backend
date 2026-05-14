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
exports.Store = void 0;
const typeorm_1 = require("typeorm");
const port_entity_1 = require("../../catalogs/entities/port.entity");
const service_type_entity_1 = require("../../catalogs/entities/service-type.entity");
const currency_entity_1 = require("../../catalogs/entities/currency.entity");
let Store = class Store {
    id;
    name;
    description;
    rfc;
    address;
    logoUrl;
    coverUrl;
    status;
    ratingAvg;
    ratingCount;
    priceFrom;
    currency;
    ports;
    serviceTypes;
    createdAt;
    updatedAt;
};
exports.Store = Store;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Store.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Store.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "rfc", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'logo_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cover_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "coverUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'PENDING_APPROVAL',
    }),
    __metadata("design:type", String)
], Store.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rating_avg', type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Store.prototype, "ratingAvg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rating_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Store.prototype, "ratingCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_from', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Store.prototype, "priceFrom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.Currency),
    (0, typeorm_1.JoinColumn)({ name: 'currency_id' }),
    __metadata("design:type", currency_entity_1.Currency)
], Store.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => port_entity_1.Port),
    (0, typeorm_1.JoinTable)({
        name: 'logistics_store_port',
        joinColumn: { name: 'store_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'port_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Store.prototype, "ports", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => service_type_entity_1.ServiceType),
    (0, typeorm_1.JoinTable)({
        name: 'logistics_store_service_type',
        joinColumn: { name: 'store_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'service_type_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Store.prototype, "serviceTypes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_date' }),
    __metadata("design:type", Date)
], Store.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'write_date' }),
    __metadata("design:type", Date)
], Store.prototype, "updatedAt", void 0);
exports.Store = Store = __decorate([
    (0, typeorm_1.Entity)('res_partner')
], Store);
//# sourceMappingURL=store.entity.js.map