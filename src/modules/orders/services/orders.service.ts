import { Injectable, NotFoundException, ForbiddenException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CancelOrderDto } from '../dto/order.dto';
import { Quotation } from '../../quotations/entities/quotation.entity';
import { User } from '../../auth/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async createFromQuotation(quotation: Quotation) {
    if (quotation.status !== 'QUOTE_APPROVED') {
      throw new UnprocessableEntityException('Quotation must be approved to create an order');
    }

    const order = this.orderRepository.create({
      quotation,
      client: quotation.client,
      store: quotation.store,
      service: quotation.service,
      totalAmount: quotation.proposedPrice,
      status: 'ORDER_CREATED',
      // TODO: Set currency based on store defaults when available
    });

    return this.orderRepository.save(order);
  }

  async findAllForClient(clientId: number) {
    return this.orderRepository.find({
      where: { client: { id: clientId } },
      relations: ['store', 'service', 'quotation'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllForStore(storeId: number) {
    return this.orderRepository.find({
      where: { store: { id: storeId } },
      relations: ['client', 'service', 'quotation'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'store', 'service', 'quotation', 'currency'],
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return order;
  }

  // --- ACTIONS (Sprint 09) ---

  async confirm(id: number, storeOwnerId: number) {
    const order = await this.findOne(id);
    await this.verifyStoreOwnership(order.store.id, storeOwnerId);

    if (order.status !== 'ORDER_CREATED') {
      throw new UnprocessableEntityException('Order cannot be confirmed from current status');
    }

    order.status = 'ORDER_CONFIRMED';
    return this.orderRepository.save(order);
  }

  async startProgress(id: number, storeOwnerId: number) {
    const order = await this.findOne(id);
    await this.verifyStoreOwnership(order.store.id, storeOwnerId);

    if (order.status !== 'ORDER_CONFIRMED') {
      // In a real system, you might allow skipping confirm and jumping to in_progress depending on flow.
      throw new UnprocessableEntityException('Order must be confirmed before marking in progress');
    }

    order.status = 'IN_PROGRESS';
    return this.orderRepository.save(order);
  }

  async complete(id: number, storeOwnerId: number) {
    const order = await this.findOne(id);
    await this.verifyStoreOwnership(order.store.id, storeOwnerId);

    if (order.status !== 'IN_PROGRESS') {
      throw new UnprocessableEntityException('Order must be in progress to be completed');
    }

    order.status = 'COMPLETED';
    return this.orderRepository.save(order);
  }

  async cancel(id: number, cancelDto: CancelOrderDto, userId: number) {
    const order = await this.findOne(id);
    
    // Both client and store can cancel before IN_PROGRESS
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const isClient = order.client.id === userId;
    const isStore = !!user && (user.role === 'PROF-SUP-003' || user.storeId === order.store.id);

    if (!isClient && !isStore) {
      throw new ForbiddenException('Not authorized to cancel this order');
    }

    if (['IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(order.status)) {
      throw new UnprocessableEntityException('Order cannot be cancelled at this stage');
    }

    order.status = 'CANCELLED';
    // cancelDto.reason could be saved in an audit_log or timeline table
    return this.orderRepository.save(order);
  }

  private async verifyStoreOwnership(storeId: number, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || (user.role !== 'PROF-SUP-003' && user.storeId !== storeId)) {
      throw new ForbiddenException('Not authorized to manage orders for this store');
    }
  }
}
