import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commission } from '../entities/commission.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Commission)
    private readonly commissionRepository: Repository<Commission>,
  ) {}

  async calculateForPayment(payment: Payment) {
    // Basic commission logic for Sprint 11
    // In a real scenario, this would look up rules from a Config table based on the store or service type.
    const DEFAULT_COMMISSION_RATE = 5.0; // 5%

    const baseAmount = payment.amount;
    const commissionAmount = (baseAmount * DEFAULT_COMMISSION_RATE) / 100;
    const netStorePayout = baseAmount - commissionAmount;

    const commission = this.commissionRepository.create({
      order: payment.order,
      payment,
      baseAmount,
      commissionRate: DEFAULT_COMMISSION_RATE,
      commissionAmount,
      netStorePayout,
      currency: payment.currency,
      status: 'PENDING',
    });

    return this.commissionRepository.save(commission);
  }

  async findAll() {
    return this.commissionRepository.find({
      relations: ['order', 'payment', 'currency'],
    });
  }

  async settle(id: number) {
    const commission = await this.commissionRepository.findOne({ where: { id } });
    if (!commission) throw new NotFoundException('Commission not found');

    commission.status = 'SETTLED';
    commission.settlementDate = new Date();

    return this.commissionRepository.save(commission);
  }
}
