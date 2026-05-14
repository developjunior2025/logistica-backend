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
exports.Payment = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../../orders/entities/order.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const currency_entity_1 = require("../../catalogs/entities/currency.entity");
let Payment = class Payment {
    id;
    order;
    registeredBy;
    amount;
    currency;
    receiptUrl;
    referenceNumber;
    status;
    validatedBy;
    validationDate;
    rejectionReason;
    createdAt;
    updatedAt;
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.Order)
], Payment.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'registered_by' }),
    __metadata("design:type", user_entity_1.User)
], Payment.prototype, "registeredBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.Currency),
    (0, typeorm_1.JoinColumn)({ name: 'currency_id' }),
    __metadata("design:type", currency_entity_1.Currency)
], Payment.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receipt_url', length: 500 }),
    __metadata("design:type", String)
], Payment.prototype, "receiptUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        default: 'PENDING_VALIDATION',
    }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'validated_by' }),
    __metadata("design:type", user_entity_1.User)
], Payment.prototype, "validatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'validation_date', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Payment.prototype, "validationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_date' }),
    __metadata("design:type", Date)
], Payment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'write_date' }),
    __metadata("design:type", Date)
], Payment.prototype, "updatedAt", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)('account_payment')
], Payment);
//# sourceMappingURL=payment.entity.js.map