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
exports.Quotation = void 0;
const typeorm_1 = require("typeorm");
const store_entity_1 = require("../../stores/entities/store.entity");
const store_service_entity_1 = require("../../stores/entities/store-service.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let Quotation = class Quotation {
    id;
    client;
    store;
    service;
    description;
    quantity;
    originPortId;
    destinationPortId;
    requiredDate;
    status;
    proposedPrice;
    proposedDays;
    storeComments;
    clientComments;
    createdAt;
    updatedAt;
};
exports.Quotation = Quotation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Quotation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", user_entity_1.User)
], Quotation.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], Quotation.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_service_entity_1.StoreService),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", store_service_entity_1.StoreService)
], Quotation.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Quotation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Quotation.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'origin_port_id', nullable: true }),
    __metadata("design:type", Number)
], Quotation.prototype, "originPortId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'destination_port_id', nullable: true }),
    __metadata("design:type", Number)
], Quotation.prototype, "destinationPortId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'required_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "requiredDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        default: 'QUOTE_REQUESTED',
    }),
    __metadata("design:type", String)
], Quotation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'proposed_price', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Quotation.prototype, "proposedPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'proposed_days', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Quotation.prototype, "proposedDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "storeComments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "clientComments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_date' }),
    __metadata("design:type", Date)
], Quotation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'write_date' }),
    __metadata("design:type", Date)
], Quotation.prototype, "updatedAt", void 0);
exports.Quotation = Quotation = __decorate([
    (0, typeorm_1.Entity)('sale_order_quotation')
], Quotation);
//# sourceMappingURL=quotation.entity.js.map