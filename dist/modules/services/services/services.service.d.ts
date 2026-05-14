import { Repository } from 'typeorm';
import { StoreService } from '../../stores/entities/store-service.entity';
import { CreateStoreServiceDto, UpdateStoreServiceDto } from '../dto/service.dto';
import { Store } from '../../stores/entities/store.entity';
import { ServiceType } from '../../catalogs/entities/service-type.entity';
import { User } from '../../auth/entities/user.entity';
export declare class ServicesService {
    private readonly storeServiceRepository;
    private readonly storeRepository;
    private readonly serviceTypeRepository;
    private readonly userRepository;
    constructor(storeServiceRepository: Repository<StoreService>, storeRepository: Repository<Store>, serviceTypeRepository: Repository<ServiceType>, userRepository: Repository<User>);
    create(storeId: number, createDto: CreateStoreServiceDto, userId: number): Promise<StoreService>;
    findAllByStore(storeId: number): Promise<StoreService[]>;
    findOne(id: number): Promise<StoreService>;
    update(id: number, updateDto: UpdateStoreServiceDto, userId: number): Promise<StoreService>;
}
