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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("../entities/store.entity");
const port_entity_1 = require("../../catalogs/entities/port.entity");
const service_type_entity_1 = require("../../catalogs/entities/service-type.entity");
let StoresService = class StoresService {
    storeRepository;
    portRepository;
    serviceTypeRepository;
    constructor(storeRepository, portRepository, serviceTypeRepository) {
        this.storeRepository = storeRepository;
        this.portRepository = portRepository;
        this.serviceTypeRepository = serviceTypeRepository;
    }
    async create(createStoreDto, userId) {
        const { portIds, serviceTypeIds, ...storeData } = createStoreDto;
        const newStore = this.storeRepository.create({
            ...storeData,
            status: 'PENDING_APPROVAL',
            ratingAvg: 0,
            ratingCount: 0,
        });
        if (portIds && portIds.length > 0) {
            newStore.ports = await this.portRepository.findByIds(portIds);
        }
        if (serviceTypeIds && serviceTypeIds.length > 0) {
            newStore.serviceTypes = await this.serviceTypeRepository.findByIds(serviceTypeIds);
        }
        const savedStore = await this.storeRepository.save(newStore);
        return savedStore;
    }
    async findAll() {
        return this.storeRepository.find({ relations: ['ports', 'serviceTypes'] });
    }
    async findOne(id) {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['ports', 'serviceTypes', 'currency'],
        });
        if (!store) {
            throw new common_1.NotFoundException(`Store with ID ${id} not found`);
        }
        return store;
    }
    async update(id, updateStoreDto) {
        const { portIds, serviceTypeIds, ...storeData } = updateStoreDto;
        const store = await this.findOne(id);
        if (portIds) {
            store.ports = await this.portRepository.findByIds(portIds);
        }
        if (serviceTypeIds) {
            store.serviceTypes = await this.serviceTypeRepository.findByIds(serviceTypeIds);
        }
        Object.assign(store, storeData);
        return this.storeRepository.save(store);
    }
    async remove(id) {
        const store = await this.findOne(id);
        return this.storeRepository.remove(store);
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(1, (0, typeorm_1.InjectRepository)(port_entity_1.Port)),
    __param(2, (0, typeorm_1.InjectRepository)(service_type_entity_1.ServiceType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map