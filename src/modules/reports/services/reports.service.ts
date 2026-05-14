import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Commission } from '../../commissions/entities/commission.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Commission) private readonly commissionRepo: Repository<Commission>,
  ) {}

  private toCsv(data: any[]): string {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row)
        .map(val => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    return [headers, ...rows].join('\n');
  }

  async exportOrdersCsv(status?: string): Promise<string> {
    const query = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.store', 'store');
      
    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    const orders = await query.getMany();

    const flatData = orders.map(o => ({
      ID: o.id,
      Total: o.totalAmount,
      Status: o.status,
      Client: o.client?.name,
      Store: o.store?.name,
      Date: o.createdAt.toISOString(),
    }));

    return this.toCsv(flatData);
  }

  async exportPaymentsCsv(): Promise<string> {
    const payments = await this.paymentRepo.find({ relations: ['order'] });
    const flatData = payments.map(p => ({
      ID: p.id,
      Amount: p.amount,
      Reference: p.referenceNumber,
      Status: p.status,
      OrderID: p.order?.id,
      Date: p.createdAt.toISOString(),
    }));
    return this.toCsv(flatData);
  }

  async exportCommissionsCsv(): Promise<string> {
    const commissions = await this.commissionRepo.find({ relations: ['order', 'order.store', 'payment'] });
    const flatData = commissions.map(c => ({
      ID: c.id,
      Store: c.order?.store?.name,
      Amount: c.commissionAmount,
      Status: c.status,
      PaymentID: c.payment?.id,
      Date: c.createdAt.toISOString(),
    }));
    return this.toCsv(flatData);
  }
}
