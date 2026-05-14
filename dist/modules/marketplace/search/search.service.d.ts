import { Repository } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
export interface ISearchParams {
    query?: string;
    portIds?: number[];
    serviceTypeIds?: number[];
    ratingMin?: number;
    priceMin?: number;
    priceMax?: number;
    verifiedOnly?: boolean;
    sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'newest';
    page?: number;
    limit?: number;
}
export declare class SearchService {
    private storeRepository;
    constructor(storeRepository: Repository<Store>);
    searchStores(params: ISearchParams): Promise<{
        data: Store[];
        total: number;
        page: number;
        limit: number;
    }>;
    getStoreById(id: number): Promise<Store | null>;
}
