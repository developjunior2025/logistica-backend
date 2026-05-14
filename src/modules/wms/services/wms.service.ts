import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from '../entities/receipt.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateReceiptDto, LocateReceiptDto } from '../dto/wms.dto';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../auth/entities/user.entity';
import { AuditService } from '../../audit/services/audit.service';

@Injectable()
export class WmsService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly auditService: AuditService,
  ) {}

  async createReceipt(dto: CreateReceiptDto, userId: number) {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const warehouse = await this.warehouseRepo.findOne({ where: { id: dto.warehouseId } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');

    const receivedBy = await this.userRepo.findOne({ where: { id: userId } });
    if (!receivedBy) throw new NotFoundException('User not found');

    // Auto-suggest location (simplified: just marks as PENDING_LOCATION)
    const receipt = this.receiptRepo.create({
      order,
      warehouse,
      receivedBy,
      items: dto.items,
      conditionNotes: dto.conditionNotes,
      conditionPhotos: dto.conditionPhotos,
      status: 'PENDING_LOCATION',
    });

    const saved = await this.receiptRepo.save(receipt);

    await this.auditService.log({
      context: { userId },
      entityType: 'WmsReceipt',
      entityId: saved.id,
      action: 'CREATE',
      level: 'MEDIUM',
      description: `Merchandise receipt created for Order #${order.id}`,
      newValue: { receiptId: saved.id, items: dto.items },
    });

    return saved;
  }

  async locate(id: number, dto: LocateReceiptDto, userId: number) {
    const receipt = await this.receiptRepo.findOne({ where: { id } });
    if (!receipt) throw new NotFoundException('Receipt not found');

    receipt.rackLocation = dto.rackLocation;
    receipt.locatedAt = new Date();
    receipt.status = 'LOCATED';

    const saved = await this.receiptRepo.save(receipt);

    await this.auditService.log({
      context: { userId },
      entityType: 'WmsReceipt',
      entityId: id,
      action: 'UPDATE',
      level: 'LOW',
      description: `Receipt #${id} located at rack: ${dto.rackLocation}`,
      newValue: { rackLocation: dto.rackLocation },
    });

    return saved;
  }

  async findInventory(filters: { warehouseId?: number; status?: string }) {
    const query = this.receiptRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.warehouse', 'warehouse')
      .leftJoinAndSelect('r.order', 'order')
      .leftJoinAndSelect('r.receivedBy', 'user');

    if (filters.warehouseId) {
      query.andWhere('warehouse.id = :warehouseId', { warehouseId: filters.warehouseId });
    }
    if (filters.status) {
      query.andWhere('r.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

  async dispatch(receiptId: number, userId: number) {
    const receipt = await this.receiptRepo.findOne({ where: { id: receiptId } });
    if (!receipt) throw new NotFoundException('Receipt not found');

    receipt.status = 'DISPATCHED';
    const saved = await this.receiptRepo.save(receipt);

    await this.auditService.log({
      context: { userId },
      entityType: 'WmsReceipt',
      entityId: receiptId,
      action: 'STATE_CHANGE',
      level: 'HIGH',
      description: `Receipt #${receiptId} dispatched from warehouse`,
      newValue: { status: 'DISPATCHED' },
    });

    return saved;
  }
}
