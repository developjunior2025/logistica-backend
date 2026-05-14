export declare class CreateStoreServiceDto {
    name: string;
    description: string;
    price: number;
    serviceTypeId: number;
    estimatedDays?: number;
}
export declare class UpdateStoreServiceDto {
    name?: string;
    description?: string;
    price?: number;
    serviceTypeId?: number;
    estimatedDays?: number;
    active?: boolean;
}
