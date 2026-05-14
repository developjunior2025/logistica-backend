import { Injectable, NotFoundException, ForbiddenException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation } from '../entities/quotation.entity';
import { 
  CreateQuotationDto, 
  RespondQuotationDto, 
  RejectQuotationDto, 
  RevisionQuotationDto 
} from '../dto/quotation.dto';
import { Store } from '../../stores/entities/store.entity';
import { StoreService } from '../../stores/entities/store-service.entity';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation)
    private readonly quotationRepository: Repository<Quotation>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(StoreService)
    private readonly serviceRepository: Repository<StoreService>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateQuotationDto, clientId: number) {
    const client = await this.userRepository.findOne({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Client not found');

    const store = await this.storeRepository.findOne({ where: { id: createDto.storeId } });
    if (!store) throw new NotFoundException('Store not found');

    const service = await this.serviceRepository.findOne({ where: { id: createDto.serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    const quotation = this.quotationRepository.create({
      client,
      store,
      service,
      description: createDto.description,
      quantity: createDto.quantity,
      originPortId: createDto.originPortId,
      destinationPortId: createDto.destinationPortId,
      requiredDate: createDto.requiredDate ? new Date(createDto.requiredDate) : undefined,
      status: 'QUOTE_REQUESTED',
    });

    return this.quotationRepository.save(quotation);
  }

  async findAllForClient(clientId: number) {
    return this.quotationRepository.find({
      where: { client: { id: clientId } },
      relations: ['store', 'service'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllForStore(storeId: number) {
    return this.quotationRepository.find({
      where: { store: { id: storeId } },
      relations: ['client', 'service'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const quotation = await this.quotationRepository.findOne({
      where: { id },
      relations: ['client', 'store', 'service'],
    });

    if (!quotation) {
      throw new NotFoundException(`Quotation ${id} not found`);
    }

    return quotation;
  }

  // --- ACTIONS (Sprints 07/08) ---

  async respond(id: number, respondDto: RespondQuotationDto, storeOwnerId: number) {
    const quotation = await this.findOne(id);
    
    // Verify store ownership
    const owner = await this.userRepository.findOne({ where: { id: storeOwnerId } });
    if (!owner || (owner.role !== 'PROF-SUP-003' && owner.storeId !== quotation.store.id)) {
      throw new ForbiddenException('Not authorized to respond on behalf of this store');
    }

    if (!['QUOTE_REQUESTED', 'REVISION_REQUESTED'].includes(quotation.status)) {
      throw new UnprocessableEntityException('Cannot respond to a quotation in this status');
    }

    quotation.proposedPrice = respondDto.proposedPrice;
    if (respondDto.proposedDays !== undefined) quotation.proposedDays = respondDto.proposedDays;
    if (respondDto.storeComments !== undefined) quotation.storeComments = respondDto.storeComments;
    quotation.status = 'QUOTE_RESPONDED';

    return this.quotationRepository.save(quotation);
  }

  async approve(id: number, clientId: number) {
    const quotation = await this.findOne(id);

    if (quotation.client.id !== clientId) {
      throw new ForbiddenException('Only the client can approve this quotation');
    }

    if (quotation.status !== 'QUOTE_RESPONDED') {
      throw new UnprocessableEntityException('Quotation must be responded to be approved');
    }

    quotation.status = 'QUOTE_APPROVED';
    const saved = await this.quotationRepository.save(quotation);

    // TODO: Create the Order automagically (Sprint 09)
    return saved;
  }

  async reject(id: number, rejectDto: RejectQuotationDto, clientId: number) {
    const quotation = await this.findOne(id);

    if (quotation.client.id !== clientId) {
      throw new ForbiddenException('Only the client can reject this quotation');
    }

    quotation.clientComments = rejectDto.clientComments;
    quotation.status = 'QUOTE_REJECTED';

    return this.quotationRepository.save(quotation);
  }

  async requestRevision(id: number, revisionDto: RevisionQuotationDto, clientId: number) {
    const quotation = await this.findOne(id);

    if (quotation.client.id !== clientId) {
      throw new ForbiddenException('Only the client can request a revision');
    }

    if (quotation.status !== 'QUOTE_RESPONDED') {
      throw new UnprocessableEntityException('Quotation must be responded to request revision');
    }

    quotation.clientComments = revisionDto.clientComments;
    quotation.status = 'REVISION_REQUESTED';

    return this.quotationRepository.save(quotation);
  }
}
