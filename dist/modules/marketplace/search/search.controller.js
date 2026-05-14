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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const search_service_1 = require("./search.service");
let SearchController = class SearchController {
    searchService;
    constructor(searchService) {
        this.searchService = searchService;
    }
    async searchStores(query, portIds, serviceTypeIds, ratingMin, priceMin, priceMax, verifiedOnly, sortBy, page, limit) {
        const parseIds = (val) => val ? val.split(',').map(Number).filter((n) => !isNaN(n)) : undefined;
        return this.searchService.searchStores({
            query,
            portIds: parseIds(portIds),
            serviceTypeIds: parseIds(serviceTypeIds),
            ratingMin: ratingMin ? Number(ratingMin) : undefined,
            priceMin: priceMin ? Number(priceMin) : undefined,
            priceMax: priceMax ? Number(priceMax) : undefined,
            verifiedOnly: verifiedOnly === 'true',
            sortBy,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async getStoreById(id) {
        const store = await this.searchService.getStoreById(Number(id));
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        return store;
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)('stores'),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('portIds')),
    __param(2, (0, common_1.Query)('serviceTypeIds')),
    __param(3, (0, common_1.Query)('ratingMin')),
    __param(4, (0, common_1.Query)('priceMin')),
    __param(5, (0, common_1.Query)('priceMax')),
    __param(6, (0, common_1.Query)('verifiedOnly')),
    __param(7, (0, common_1.Query)('sortBy')),
    __param(8, (0, common_1.Query)('page')),
    __param(9, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchStores", null);
__decorate([
    (0, common_1.Get)('stores/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getStoreById", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map