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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("../../stores/entities/store.entity");
let SearchService = class SearchService {
    storeRepository;
    constructor(storeRepository) {
        this.storeRepository = storeRepository;
    }
    async searchStores(params) {
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 12;
        const skip = (page - 1) * limit;
        const queryBuilder = this.storeRepository
            .createQueryBuilder('store')
            .leftJoinAndSelect('store.currency', 'currency')
            .leftJoinAndSelect('store.ports', 'port')
            .leftJoinAndSelect('store.serviceTypes', 'serviceType')
            .where('store.status = :status', { status: 'ACTIVE' });
        if (params.query) {
            queryBuilder.andWhere('(store.name LIKE :query OR store.description LIKE :query)', { query: `%${params.query}%` });
        }
        if (params.portIds && params.portIds.length > 0) {
            queryBuilder.andWhere('port.id IN (:...portIds)', {
                portIds: params.portIds,
            });
        }
        if (params.serviceTypeIds && params.serviceTypeIds.length > 0) {
            queryBuilder.andWhere('serviceType.id IN (:...serviceTypeIds)', {
                serviceTypeIds: params.serviceTypeIds,
            });
        }
        if (params.ratingMin) {
            queryBuilder.andWhere('store.ratingAvg >= :ratingMin', {
                ratingMin: params.ratingMin,
            });
        }
        if (params.priceMin) {
            queryBuilder.andWhere('store.priceFrom >= :priceMin', {
                priceMin: params.priceMin,
            });
        }
        if (params.priceMax) {
            queryBuilder.andWhere('store.priceFrom <= :priceMax', {
                priceMax: params.priceMax,
            });
        }
        const sortBy = params.sortBy || 'rating';
        switch (sortBy) {
            case 'price_asc':
                queryBuilder.orderBy('store.priceFrom', 'ASC');
                break;
            case 'price_desc':
                queryBuilder.orderBy('store.priceFrom', 'DESC');
                break;
            case 'newest':
                queryBuilder.orderBy('store.createdAt', 'DESC');
                break;
            case 'rating':
            default:
                queryBuilder.orderBy('store.ratingAvg', 'DESC').addOrderBy('store.ratingCount', 'DESC');
                break;
        }
        const [stores, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            data: stores,
            total,
            page,
            limit,
        };
    }
    async getStoreById(id) {
        return this.storeRepository.findOne({
            where: { id, status: 'ACTIVE' },
            relations: ['currency', 'ports', 'serviceTypes'],
        });
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SearchService);
//# sourceMappingURL=search.service.js.map