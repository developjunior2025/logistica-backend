import { User } from '../../auth/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { StoreService } from '../../stores/entities/store-service.entity';
import { Quotation } from '../../quotations/entities/quotation.entity';
import { Currency } from '../../catalogs/entities/currency.entity';
export type TOrderStatus = 'ORDER_CREATED' | 'ORDER_CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export declare class Order {
    id: number;
    quotation: Quotation;
    client: User;
    store: Store;
    service: StoreService;
    status: TOrderStatus;
    totalAmount: number;
    currency: Currency;
    createdAt: Date;
    updatedAt: Date;
}
