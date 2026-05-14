import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Commission } from '../../commissions/entities/commission.entity';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Commission) private readonly commissionRepo: Repository<Commission>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getClientMetrics(userId: number) {
    const activeOrders = await this.orderRepo.count({
      where: { client: { id: userId }, status: 'IN_PROGRESS' },
    });
    const pendingPayments = await this.paymentRepo.count({
      where: { order: { client: { id: userId } }, status: 'PENDING_VALIDATION' },
    });

    return { activeOrders, pendingPayments };
  }

  async getStoreMetrics(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const storeId = user?.storeId || 0;

    const storeOrders = await this.orderRepo.count({
      where: { store: { id: storeId }, status: 'ORDER_CREATED' },
    });
    const commissionsToPay = await this.commissionRepo.count({
      where: { order: { store: { id: storeId } }, status: 'PENDING' },
    });

    return {
      newOrders: storeOrders,
      pendingCommissions: commissionsToPay,
    };
  }

  async getAdminMetrics() {
    const totalOrders = await this.orderRepo.count();
    const pendingValidations = await this.paymentRepo.count({
      where: { status: 'PENDING_VALIDATION' },
    });
    const pendingCommissions = await this.commissionRepo.count({
      where: { status: 'PENDING' },
    });

    return {
      totalOrders,
      pendingValidations,
      pendingCommissions,
    };
  }
}
