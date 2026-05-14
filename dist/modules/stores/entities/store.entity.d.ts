import { Port } from '../../catalogs/entities/port.entity';
import { ServiceType } from '../../catalogs/entities/service-type.entity';
import { Currency } from '../../catalogs/entities/currency.entity';
export type TStoreStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
export declare class Store {
    id: number;
    name: string;
    description: string;
    rfc: string;
    address: string;
    logoUrl: string;
    coverUrl: string;
    status: TStoreStatus;
    ratingAvg: number;
    ratingCount: number;
    priceFrom: number;
    currency: Currency;
    ports: Port[];
    serviceTypes: ServiceType[];
    createdAt: Date;
    updatedAt: Date;
}
