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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quotation_entity_1 = require("../entities/quotation.entity");
const store_entity_1 = require("../../stores/entities/store.entity");
const store_service_entity_1 = require("../../stores/entities/store-service.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let QuotationsService = class QuotationsService {
    quotationRepository;
    storeRepository;
    serviceRepository;
    userRepository;
    constructor(quotationRepository, storeRepository, serviceRepository, userRepository) {
        this.quotationRepository = quotationRepository;
        this.storeRepository = storeRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }
    async create(createDto, clientId) {
        const client = await this.userRepository.findOne({ where: { id: clientId } });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        const store = await this.storeRepository.findOne({ where: { id: createDto.storeId } });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        const service = await this.serviceRepository.findOne({ where: { id: createDto.serviceId } });
        if (!service)
            throw new common_1.NotFoundException('Service not found');
        const quotation = this.quotationRepository.create({
            client,
            store,
            service,
            description: createDto.description,
            quantity: createDto.quantity,
            originPortId: createDto.originPortId,
            destinationPortId: createDto.destinationPortId,
            requiredDate: createDto.requiredDate ? new Date(createDto.requiredDate) : undefined,
            status: 'QUOTE_REQUESTED',
        });
        return this.quotationRepository.save(quotation);
    }
    async findAllForClient(clientId) {
        return this.quotationRepository.find({
            where: { client: { id: clientId } },
            relations: ['store', 'service'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAllForStore(storeId) {
        return this.quotationRepository.find({
            where: { store: { id: storeId } },
            relations: ['client', 'service'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const quotation = await this.quotationRepository.findOne({
            where: { id },
            relations: ['client', 'store', 'service'],
        });
        if (!quotation) {
            throw new common_1.NotFoundException(`Quotation ${id} not found`);
        }
        return quotation;
    }
    async respond(id, respondDto, storeOwnerId) {
        const quotation = await this.findOne(id);
        const owner = await this.userRepository.findOne({ where: { id: storeOwnerId } });
        if (!owner || (owner.role !== 'PROF-SUP-003' && owner.storeId !== quotation.store.id)) {
            throw new common_1.ForbiddenException('Not authorized to respond on behalf of this store');
        }
        if (!['QUOTE_REQUESTED', 'REVISION_REQUESTED'].includes(quotation.status)) {
            throw new common_1.UnprocessableEntityException('Cannot respond to a quotation in this status');
        }
        quotation.proposedPrice = respondDto.proposedPrice;
        if (respondDto.proposedDays !== undefined)
            quotation.proposedDays = respondDto.proposedDays;
        if (respondDto.storeComments !== undefined)
            quotation.storeComments = respondDto.storeComments;
        quotation.status = 'QUOTE_RESPONDED';
        return this.quotationRepository.save(quotation);
    }
    async approve(id, clientId) {
        const quotation = await this.findOne(id);
        if (quotation.client.id !== clientId) {
            throw new common_1.ForbiddenException('Only the client can approve this quotation');
        }
        if (quotation.status !== 'QUOTE_RESPONDED') {
            throw new common_1.UnprocessableEntityException('Quotation must be responded to be approved');
        }
        quotation.status = 'QUOTE_APPROVED';
        const saved = await this.quotationRepository.save(quotation);
        return saved;
    }
    async reject(id, rejectDto, clientId) {
        const quotation = await this.findOne(id);
        if (quotation.client.id !== clientId) {
            throw new common_1.ForbiddenException('Only the client can reject this quotation');
        }
        quotation.clientComments = rejectDto.clientComments;
        quotation.status = 'QUOTE_REJECTED';
        return this.quotationRepository.save(quotation);
    }
    async requestRevision(id, revisionDto, clientId) {
        const quotation = await this.findOne(id);
        if (quotation.client.id !== clientId) {
            throw new common_1.ForbiddenException('Only the client can request a revision');
        }
        if (quotation.status !== 'QUOTE_RESPONDED') {
            throw new common_1.UnprocessableEntityException('Quotation must be responded to request revision');
        }
        quotation.clientComments = revisionDto.clientComments;
        quotation.status = 'REVISION_REQUESTED';
        return this.quotationRepository.save(quotation);
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quotation_entity_1.Quotation)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(2, (0, typeorm_1.InjectRepository)(store_service_entity_1.StoreService)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map