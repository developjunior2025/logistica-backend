import { Injectable, NotFoundException, ForbiddenException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { RegisterPaymentDto, RejectPaymentDto } from '../dto/payment.dto';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../auth/entities/user.entity';
import { Currency } from '../../catalogs/entities/currency.entity';
import { CommissionsService } from '../../commissions/services/commissions.service';
import { forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @Inject(forwardRef(() => CommissionsService))
    private readonly commissionsService: CommissionsService,
  ) {}

  async register(registerDto: RegisterPaymentDto, clientId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: registerDto.orderId },
      relations: ['client'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.client.id !== clientId) {
      throw new ForbiddenException('You can only register payments for your own orders');
    }

    if (['COMPLETED', 'CANCELLED'].includes(order.status)) {
      throw new UnprocessableEntityException('Cannot register payment for completed or cancelled orders');
    }

    const client = await this.userRepository.findOne({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Client user not found');

    const currency = await this.currencyRepository.findOne({ where: { id: registerDto.currencyId } });
    if (!currency) throw new NotFoundException('Currency not found');

    const payment = this.paymentRepository.create({
      order,
      registeredBy: client,
      amount: registerDto.amount,
      currency,
      receiptUrl: registerDto.receiptUrl,
      referenceNumber: registerDto.referenceNumber,
      status: 'PENDING_VALIDATION',
    });

    return this.paymentRepository.save(payment);
  }

  async findAll() {
    return this.paymentRepository.find({ relations: ['order', 'registeredBy', 'currency'] });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order', 'registeredBy', 'currency', 'validatedBy'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }

    return payment;
  }

  // --- ACTIONS (Sprint 10) ---

  async validate(id: number, operatorId: number) {
    const payment = await this.findOne(id);

    if (payment.status !== 'PENDING_VALIDATION') {
      throw new UnprocessableEntityException('Payment is not pending validation');
    }

    const operator = await this.userRepository.findOne({ where: { id: operatorId } });
    if (!operator) throw new NotFoundException('Operator not found');

    payment.status = 'VALIDATED';
    payment.validatedBy = operator;
    payment.validationDate = new Date();

    const savedPayment = await this.paymentRepository.save(payment);

    // Trigger Commission Calculation (Sprint 11)
    await this.commissionsService.calculateForPayment(savedPayment);

    return savedPayment;
  }

  async reject(id: number, rejectDto: RejectPaymentDto, operatorId: number) {
    const payment = await this.findOne(id);

    if (payment.status !== 'PENDING_VALIDATION') {
      throw new UnprocessableEntityException('Payment is not pending validation');
    }

    const operator = await this.userRepository.findOne({ where: { id: operatorId } });
    if (!operator) throw new NotFoundException('Operator not found');

    payment.status = 'REJECTED';
    payment.validatedBy = operator;
    payment.validationDate = new Date();
    payment.rejectionReason = rejectDto.rejectionReason;

    return this.paymentRepository.save(payment);
  }
}
