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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_service_entity_1 = require("../../stores/entities/store-service.entity");
const store_entity_1 = require("../../stores/entities/store.entity");
const service_type_entity_1 = require("../../catalogs/entities/service-type.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let ServicesService = class ServicesService {
    storeServiceRepository;
    storeRepository;
    serviceTypeRepository;
    userRepository;
    constructor(storeServiceRepository, storeRepository, serviceTypeRepository, userRepository) {
        this.storeServiceRepository = storeServiceRepository;
        this.storeRepository = storeRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.userRepository = userRepository;
    }
    async create(storeId, createDto, userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || (user.role !== 'PROF-SUP-003' && user.storeId !== storeId)) {
            throw new common_1.ForbiddenException('No tienes permiso para agregar servicios a esta tienda');
        }
        const store = await this.storeRepository.findOne({ where: { id: storeId } });
        if (!store) {
            throw new common_1.NotFoundException(`Tienda con ID ${storeId} no encontrada`);
        }
        const serviceType = await this.serviceTypeRepository.findOne({
            where: { id: createDto.serviceTypeId },
        });
        if (!serviceType) {
            throw new common_1.NotFoundException(`Tipo de servicio ID ${createDto.serviceTypeId} no encontrado`);
        }
        const newService = this.storeServiceRepository.create({
            ...createDto,
            store,
            serviceType,
        });
        return this.storeServiceRepository.save(newService);
    }
    async findAllByStore(storeId) {
        return this.storeServiceRepository.find({
            where: { store: { id: storeId }, active: true },
            relations: ['serviceType'],
        });
    }
    async findOne(id) {
        const service = await this.storeServiceRepository.findOne({
            where: { id },
            relations: ['store', 'serviceType'],
        });
        if (!service) {
            throw new common_1.NotFoundException(`Servicio ID ${id} no encontrado`);
        }
        return service;
    }
    async update(id, updateDto, userId) {
        const service = await this.findOne(id);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || (user.role !== 'PROF-SUP-003' && user.storeId !== service.store.id)) {
            throw new common_1.ForbiddenException('No tienes permiso para editar este servicio');
        }
        if (updateDto.serviceTypeId) {
            const serviceType = await this.serviceTypeRepository.findOne({
                where: { id: updateDto.serviceTypeId },
            });
            if (serviceType) {
                service.serviceType = serviceType;
            }
        }
        Object.assign(service, updateDto);
        return this.storeServiceRepository.save(service);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_service_entity_1.StoreService)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(2, (0, typeorm_1.InjectRepository)(service_type_entity_1.ServiceType)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map