import { ServicesService } from '../services/services.service';
import { CreateStoreServiceDto, UpdateStoreServiceDto } from '../dto/service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(storeId: string, createServiceDto: CreateStoreServiceDto, req: any): Promise<import("../../stores/entities/store-service.entity").StoreService>;
    findAll(storeId: string): Promise<import("../../stores/entities/store-service.entity").StoreService[]>;
    findOne(serviceId: string): Promise<import("../../stores/entities/store-service.entity").StoreService>;
    update(serviceId: string, updateServiceDto: UpdateStoreServiceDto, req: any): Promise<import("../../stores/entities/store-service.entity").StoreService>;
}
