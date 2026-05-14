import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Container } from '../entities/container.entity';
import { Yard } from '../entities/yard.entity';
import { GateEvent } from '../entities/gate-event.entity';
import { CreateContainerDto, MoveContainerDto, GateInDto, GateOutDto } from '../dto/tos.dto';
import { AuditService } from '../../audit/services/audit.service';
import { User } from '../../auth/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

@Injectable()
export class TosService {
  constructor(
    @InjectRepository(Container)
    private readonly containerRepo: Repository<Container>,
    @InjectRepository(Yard)
    private readonly yardRepo: Repository<Yard>,
    @InjectRepository(GateEvent)
    private readonly gateEventRepo: Repository<GateEvent>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly auditService: AuditService,
  ) {}

  // ── Containers ─────────────────────────────────────────────

  async createContainer(dto: CreateContainerDto, userId: number) {
    const existing = await this.containerRepo.findOne({
      where: { containerNumber: dto.containerNumber },
    });
    if (existing) {
      throw new UnprocessableEntityException(
        `Container ${dto.containerNumber} already exists`,
      );
    }

    const container = this.containerRepo.create({
      containerNumber: dto.containerNumber,
      type: dto.type,
      status: 'REGISTERED',
    });

    if (dto.orderId) {
      const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });
      if (order) container.order = order;
    }
    if (dto.ownerId) {
      const owner = await this.userRepo.findOne({ where: { id: dto.ownerId } });
      if (owner) container.owner = owner;
    }

    const saved = await this.containerRepo.save(container);

    await this.auditService.log({
      context: { userId },
      entityType: 'Container',
      entityId: saved.id,
      action: 'CREATE',
      level: 'MEDIUM',
      description: `Container ${saved.containerNumber} registered`,
      newValue: saved as unknown as object,
    });

    return saved;
  }

  async findContainers(filters: {
    status?: string;
    zone?: string;
    orderId?: number;
  }) {
    const query = this.containerRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.yard', 'yard')
      .leftJoinAndSelect('c.owner', 'owner')
      .leftJoinAndSelect('c.order', 'order');

    if (filters.status) query.andWhere('c.status = :status', { status: filters.status });
    if (filters.zone) query.andWhere('c.zone = :zone', { zone: filters.zone });
    if (filters.orderId) query.andWhere('order.id = :orderId', { orderId: filters.orderId });

    return query.getMany();
  }

  async findContainer(id: number) {
    const container = await this.containerRepo.findOne({
      where: { id },
      relations: ['yard', 'owner', 'order'],
    });
    if (!container) throw new NotFoundException(`Container ${id} not found`);
    return container;
  }

  async moveContainer(id: number, dto: MoveContainerDto, userId: number) {
    const container = await this.findContainer(id);

    if (container.isBlocked) {
      throw new ForbiddenException(
        `Container ${container.containerNumber} is blocked (AGD). Cannot move.`,
      );
    }

    const yard = await this.yardRepo.findOne({ where: { id: dto.yardId } });
    if (!yard) throw new NotFoundException('Yard not found');

    const prev = { ...container };

    container.yard = yard;
    container.zone = dto.zone;
    container.row = dto.row;
    container.bay = dto.bay;
    container.tier = dto.tier;

    const saved = await this.containerRepo.save(container);

    await this.auditService.log({
      context: { userId },
      entityType: 'Container',
      entityId: id,
      action: 'UPDATE',
      level: 'LOW',
      description: `Container ${container.containerNumber} moved to ${dto.zone}-${dto.row}-${dto.bay}-${dto.tier}`,
      previousValue: prev as unknown as object,
      newValue: saved as unknown as object,
    });

    return saved;
  }

  async findYards() {
    return this.yardRepo.find({ relations: ['port'] });
  }

  // ── Gate-in ─────────────────────────────────────────────────

  async gateIn(dto: GateInDto, userId: number) {
    const container = await this.containerRepo.findOne({
      where: { containerNumber: dto.containerNumber },
    });
    if (!container) throw new NotFoundException(`Container ${dto.containerNumber} not found`);

    if (container.isBlocked) {
      throw new ForbiddenException(
        `Container ${dto.containerNumber} has an active AGD block. Gate-in denied.`,
      );
    }

    const inspector = dto.inspectorId
      ? await this.userRepo.findOne({ where: { id: dto.inspectorId } })
      : null;

    const event = this.gateEventRepo.create({
      container,
      type: 'GATE_IN',
      truckPlate: dto.truckPlate,
      driverName: dto.driverName,
      inspector: inspector || undefined,
      conditionPhotos: dto.conditionPhotos,
      notes: dto.notes,
      eventTime: dto.eventTime ? new Date(dto.eventTime) : new Date(),
    });

    container.status = 'IN_YARD';
    await this.containerRepo.save(container);
    const savedEvent = await this.gateEventRepo.save(event);

    await this.auditService.log({
      context: { userId },
      entityType: 'Container',
      entityId: container.id,
      action: 'GATE_IN',
      level: 'HIGH',
      description: `Gate-IN: ${container.containerNumber} | Truck: ${dto.truckPlate} | Driver: ${dto.driverName}`,
      newValue: savedEvent as unknown as object,
    });

    return savedEvent;
  }

  // ── Gate-out ─────────────────────────────────────────────────

  async gateOut(dto: GateOutDto, userId: number) {
    const container = await this.containerRepo.findOne({
      where: { containerNumber: dto.containerNumber },
      relations: ['order'],
    });
    if (!container) throw new NotFoundException(`Container ${dto.containerNumber} not found`);

    // CRITICAL: Block check (AGD)
    if (container.isBlocked) {
      throw new ForbiddenException(
        `Container ${dto.containerNumber} has an active AGD block. Gate-out DENIED.`,
      );
    }

    // Validate order status if linked
    if (container.order) {
      const validStatuses = ['COMPLETED', 'PAYMENT_SUBMITTED'];
      if (!validStatuses.includes(container.order.status)) {
        throw new UnprocessableEntityException(
          `Associated order must be COMPLETED or PAYMENT_SUBMITTED for gate-out`,
        );
      }
    }

    const event = this.gateEventRepo.create({
      container,
      type: 'GATE_OUT',
      truckPlate: dto.truckPlate,
      driverName: dto.driverName,
      conditionPhotos: dto.conditionPhotos,
      notes: dto.notes,
      eventTime: dto.eventTime ? new Date(dto.eventTime) : new Date(),
    });

    container.status = 'GATE_OUT';
    await this.containerRepo.save(container);
    const savedEvent = await this.gateEventRepo.save(event);

    await this.auditService.log({
      context: { userId },
      entityType: 'Container',
      entityId: container.id,
      action: 'GATE_OUT',
      level: 'CRITICAL',
      description: `Gate-OUT: ${container.containerNumber} | Truck: ${dto.truckPlate} | Driver: ${dto.driverName}`,
      newValue: savedEvent as unknown as object,
    });

    return savedEvent;
  }
}
