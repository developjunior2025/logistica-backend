import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchStores(query?: string, portIds?: string, serviceTypeIds?: string, ratingMin?: string, priceMin?: string, priceMax?: string, verifiedOnly?: string, sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'newest', page?: string, limit?: string): Promise<{
        data: import("../../stores/entities/store.entity").Store[];
        total: number;
        page: number;
        limit: number;
    }>;
    getStoreById(id: string): Promise<import("../../stores/entities/store.entity").Store>;
}
