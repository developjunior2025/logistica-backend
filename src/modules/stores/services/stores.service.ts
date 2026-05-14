import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { CreateStoreDto, UpdateStoreDto } from '../dto/store.dto';
import { Port } from '../../catalogs/entities/port.entity';
import { ServiceType } from '../../catalogs/entities/service-type.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Port)
    private readonly portRepository: Repository<Port>,
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async create(createStoreDto: CreateStoreDto, userId: number) {
    const { portIds, serviceTypeIds, ...storeData } = createStoreDto;

    const newStore = this.storeRepository.create({
      ...storeData,
      status: 'PENDING_APPROVAL',
      ratingAvg: 0,
      ratingCount: 0,
    });

    if (portIds && portIds.length > 0) {
      newStore.ports = await this.portRepository.findByIds(portIds);
    }

    if (serviceTypeIds && serviceTypeIds.length > 0) {
      newStore.serviceTypes = await this.serviceTypeRepository.findByIds(serviceTypeIds);
    }

    const savedStore = await this.storeRepository.save(newStore);

    // TODO: Update the user to reference this store ID. This will require bringing in the UserRepository.
    return savedStore;
  }

  async findAll() {
    return this.storeRepository.find({ relations: ['ports', 'serviceTypes'] });
  }

  async findOne(id: number) {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['ports', 'serviceTypes', 'currency'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const { portIds, serviceTypeIds, ...storeData } = updateStoreDto;
    
    const store = await this.findOne(id);

    if (portIds) {
      store.ports = await this.portRepository.findByIds(portIds);
    }

    if (serviceTypeIds) {
      store.serviceTypes = await this.serviceTypeRepository.findByIds(serviceTypeIds);
    }

    Object.assign(store, storeData);
    
    return this.storeRepository.save(store);
  }

  async remove(id: number) {
    const store = await this.findOne(id);
    return this.storeRepository.remove(store);
  }
}
