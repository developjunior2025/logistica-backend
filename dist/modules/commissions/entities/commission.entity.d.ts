import { Order } from '../../orders/entities/order.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Currency } from '../../catalogs/entities/currency.entity';
export type TCommissionStatus = 'PENDING' | 'SETTLED';
export declare class Commission {
    id: number;
    order: Order;
    payment: Payment;
    baseAmount: number;
    commissionRate: number;
    commissionAmount: number;
    netStorePayout: number;
    currency: Currency;
    status: TCommissionStatus;
    settlementDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
