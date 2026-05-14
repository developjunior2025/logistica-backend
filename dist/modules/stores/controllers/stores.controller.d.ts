import { StoresService } from '../services/stores.service';
import { CreateStoreDto, UpdateStoreDto } from '../dto/store.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    create(createStoreDto: CreateStoreDto, req: any): Promise<import("../entities/store.entity").Store>;
    findAll(): Promise<import("../entities/store.entity").Store[]>;
    findOne(id: string): Promise<import("../entities/store.entity").Store>;
    update(id: string, updateStoreDto: UpdateStoreDto): Promise<import("../entities/store.entity").Store>;
    remove(id: string): Promise<import("../entities/store.entity").Store>;
}
