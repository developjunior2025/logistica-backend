export declare class CreateStoreDto {
    name: string;
    description: string;
    rfc?: string;
    address?: string;
    currencyId?: number;
    portIds?: number[];
    serviceTypeIds?: number[];
}
export declare class UpdateStoreDto {
    name?: string;
    description?: string;
    rfc?: string;
    address?: string;
    currencyId?: number;
    portIds?: number[];
    serviceTypeIds?: number[];
}
