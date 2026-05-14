import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreService } from '../../stores/entities/store-service.entity';
import { CreateStoreServiceDto, UpdateStoreServiceDto } from '../dto/service.dto';
import { Store } from '../../stores/entities/store.entity';
import { ServiceType } from '../../catalogs/entities/service-type.entity';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(StoreService)
    private readonly storeServiceRepository: Repository<StoreService>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(storeId: number, createDto: CreateStoreServiceDto, userId: number) {
    // Verificar que el usuario sea el dueño de la tienda o un superadmin
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || (user.role !== 'PROF-SUP-003' && user.storeId !== storeId)) {
      throw new ForbiddenException('No tienes permiso para agregar servicios a esta tienda');
    }

    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Tienda con ID ${storeId} no encontrada`);
    }

    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id: createDto.serviceTypeId },
    });
    if (!serviceType) {
      throw new NotFoundException(`Tipo de servicio ID ${createDto.serviceTypeId} no encontrado`);
    }

    const newService = this.storeServiceRepository.create({
      ...createDto,
      store,
      serviceType,
    });

    return this.storeServiceRepository.save(newService);
  }

  async findAllByStore(storeId: number) {
    return this.storeServiceRepository.find({
      where: { store: { id: storeId }, active: true },
      relations: ['serviceType'],
    });
  }

  async findOne(id: number) {
    const service = await this.storeServiceRepository.findOne({
      where: { id },
      relations: ['store', 'serviceType'],
    });

    if (!service) {
      throw new NotFoundException(`Servicio ID ${id} no encontrado`);
    }

    return service;
  }

  async update(id: number, updateDto: UpdateStoreServiceDto, userId: number) {
    const service = await this.findOne(id);

    // Verificar permisos
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || (user.role !== 'PROF-SUP-003' && user.storeId !== service.store.id)) {
      throw new ForbiddenException('No tienes permiso para editar este servicio');
    }

    if (updateDto.serviceTypeId) {
      const serviceType = await this.serviceTypeRepository.findOne({
        where: { id: updateDto.serviceTypeId },
      });
      if (serviceType) {
        service.serviceType = serviceType;
      }
    }

    Object.assign(service, updateDto);
    return this.storeServiceRepository.save(service);
  }
}
