import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';
import { CreateTripDto, PodDto } from '../dto/transport.dto';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../auth/entities/user.entity';
import { AuditService } from '../../audit/services/audit.service';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly auditService: AuditService,
  ) {}

  async createTrip(dto: CreateTripDto, userId: number) {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const driver = await this.userRepo.findOne({ where: { id: dto.driverId } });
    if (!driver) throw new NotFoundException('Driver not found');

    const trip = this.tripRepo.create({
      order,
      driver,
      origin: dto.origin,
      destination: dto.destination,
      vehiclePlate: dto.vehiclePlate,
      cargoType: dto.cargoType,
      scheduledDate: new Date(dto.scheduledDate),
      status: 'SCHEDULED',
    });

    const saved = await this.tripRepo.save(trip);

    await this.auditService.log({
      context: { userId },
      entityType: 'Trip',
      entityId: saved.id,
      action: 'CREATE',
      level: 'MEDIUM',
      description: `Trip #${saved.id} created for Order #${order.id}`,
    });

    return saved;
  }

  async startTrip(id: number, userId: number) {
    const trip = await this.findOne(id);

    if (trip.status !== 'SCHEDULED') {
      throw new UnprocessableEntityException('Trip must be SCHEDULED to start');
    }

    trip.status = 'IN_TRANSIT';
    trip.startedAt = new Date();

    return this.tripRepo.save(trip);
  }

  async registerPod(id: number, dto: PodDto, userId: number) {
    const trip = await this.findOne(id);

    if (trip.status !== 'IN_TRANSIT') {
      throw new UnprocessableEntityException('Trip must be IN_TRANSIT to register POD');
    }

    if (dto.podSignatureUrl !== undefined) trip.podSignatureUrl = dto.podSignatureUrl;
    if (dto.podPhotos !== undefined) trip.podPhotos = dto.podPhotos;
    if (dto.podNotes !== undefined) trip.podNotes = dto.podNotes;
    trip.deliveredAt = new Date();
    trip.status = 'DELIVERED';

    const saved = await this.tripRepo.save(trip);

    await this.auditService.log({
      context: { userId },
      entityType: 'Trip',
      entityId: id,
      action: 'STATE_CHANGE',
      level: 'HIGH',
      description: `POD registered for Trip #${id}. Delivered at ${saved.deliveredAt.toISOString()}`,
      newValue: { status: 'DELIVERED', deliveredAt: saved.deliveredAt },
    });

    return saved;
  }

  async findAll() {
    return this.tripRepo.find({ relations: ['order', 'driver'] });
  }

  async findOne(id: number) {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: ['order', 'driver'],
    });
    if (!trip) throw new NotFoundException(`Trip ${id} not found`);
    return trip;
  }
}
