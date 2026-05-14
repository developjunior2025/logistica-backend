import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { CreateStoreDto, UpdateStoreDto } from '../dto/store.dto';
import { Port } from '../../catalogs/entities/port.entity';
import { ServiceType } from '../../catalogs/entities/service-type.entity';
export declare class StoresService {
    private readonly storeRepository;
    private readonly portRepository;
    private readonly serviceTypeRepository;
    constructor(storeRepository: Repository<Store>, portRepository: Repository<Port>, serviceTypeRepository: Repository<ServiceType>);
    create(createStoreDto: CreateStoreDto, userId: number): Promise<Store>;
    findAll(): Promise<Store[]>;
    findOne(id: number): Promise<Store>;
    update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store>;
    remove(id: number): Promise<Store>;
}
