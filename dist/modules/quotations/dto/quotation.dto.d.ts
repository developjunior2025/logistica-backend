export declare class CreateQuotationDto {
    storeId: number;
    serviceId: number;
    description: string;
    quantity: number;
    originPortId?: number;
    destinationPortId?: number;
    requiredDate?: string;
}
export declare class RespondQuotationDto {
    proposedPrice: number;
    proposedDays?: number;
    storeComments?: string;
}
export declare class RejectQuotationDto {
    clientComments: string;
}
export declare class RevisionQuotationDto {
    clientComments: string;
}
