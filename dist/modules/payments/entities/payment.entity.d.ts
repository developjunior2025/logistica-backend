import { Order } from '../../orders/entities/order.entity';
import { User } from '../../auth/entities/user.entity';
import { Currency } from '../../catalogs/entities/currency.entity';
export type TPaymentStatus = 'PENDING_VALIDATION' | 'VALIDATED' | 'REJECTED';
export declare class Payment {
    id: number;
    order: Order;
    registeredBy: User;
    amount: number;
    currency: Currency;
    receiptUrl: string;
    referenceNumber: string;
    status: TPaymentStatus;
    validatedBy: User;
    validationDate: Date;
    rejectionReason: string;
    createdAt: Date;
    updatedAt: Date;
}
