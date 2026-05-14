import { Store } from '../../stores/entities/store.entity';
import { StoreService } from '../../stores/entities/store-service.entity';
import { User } from '../../auth/entities/user.entity';
export type TQuotationStatus = 'QUOTE_REQUESTED' | 'QUOTE_RESPONDED' | 'QUOTE_APPROVED' | 'QUOTE_REJECTED' | 'REVISION_REQUESTED';
export declare class Quotation {
    id: number;
    client: User;
    store: Store;
    service: StoreService;
    description: string;
    quantity: number;
    originPortId: number;
    destinationPortId: number;
    requiredDate: Date;
    status: TQuotationStatus;
    proposedPrice: number;
    proposedDays: number;
    storeComments: string;
    clientComments: string;
    createdAt: Date;
    updatedAt: Date;
}
