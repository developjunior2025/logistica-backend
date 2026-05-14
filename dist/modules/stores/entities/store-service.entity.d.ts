import { Store } from './store.entity';
import { ServiceType } from '../../catalogs/entities/service-type.entity';
export declare class StoreService {
    id: number;
    name: string;
    description: string;
    price: number;
    store: Store;
    serviceType: ServiceType;
    estimatedDays: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
