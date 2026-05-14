import { Repository } from 'typeorm';
import { Quotation } from '../entities/quotation.entity';
import { CreateQuotationDto, RespondQuotationDto, RejectQuotationDto, RevisionQuotationDto } from '../dto/quotation.dto';
import { Store } from '../../stores/entities/store.entity';
import { StoreService } from '../../stores/entities/store-service.entity';
import { User } from '../../auth/entities/user.entity';
export declare class QuotationsService {
    private readonly quotationRepository;
    private readonly storeRepository;
    private readonly serviceRepository;
    private readonly userRepository;
    constructor(quotationRepository: Repository<Quotation>, storeRepository: Repository<Store>, serviceRepository: Repository<StoreService>, userRepository: Repository<User>);
    create(createDto: CreateQuotationDto, clientId: number): Promise<Quotation>;
    findAllForClient(clientId: number): Promise<Quotation[]>;
    findAllForStore(storeId: number): Promise<Quotation[]>;
    findOne(id: number): Promise<Quotation>;
    respond(id: number, respondDto: RespondQuotationDto, storeOwnerId: number): Promise<Quotation>;
    approve(id: number, clientId: number): Promise<Quotation>;
    reject(id: number, rejectDto: RejectQuotationDto, clientId: number): Promise<Quotation>;
    requestRevision(id: number, revisionDto: RevisionQuotationDto, clientId: number): Promise<Quotation>;
}
