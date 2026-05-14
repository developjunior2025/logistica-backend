import { QuotationsService } from '../services/quotations.service';
import { CreateQuotationDto, RespondQuotationDto, RejectQuotationDto, RevisionQuotationDto } from '../dto/quotation.dto';
export declare class QuotationsController {
    private readonly quotationsService;
    constructor(quotationsService: QuotationsService);
    create(createQuotationDto: CreateQuotationDto, req: any): Promise<import("../entities/quotation.entity").Quotation>;
    findAll(req: any): Promise<import("../entities/quotation.entity").Quotation[]>;
    findOne(id: string): Promise<import("../entities/quotation.entity").Quotation>;
    respond(id: string, respondDto: RespondQuotationDto, req: any): Promise<import("../entities/quotation.entity").Quotation>;
    approve(id: string, req: any): Promise<import("../entities/quotation.entity").Quotation>;
    reject(id: string, rejectDto: RejectQuotationDto, req: any): Promise<import("../entities/quotation.entity").Quotation>;
    requestRevision(id: string, revisionDto: RevisionQuotationDto, req: any): Promise<import("../entities/quotation.entity").Quotation>;
}
