import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

export interface ISearchParams {
  query?: string;
  portIds?: number[];
  serviceTypeIds?: number[];
  ratingMin?: number;
  priceMin?: number;
  priceMax?: number;
  verifiedOnly?: boolean;
  sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async searchStores(params: ISearchParams) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 12;
    const skip = (page - 1) * limit;

    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.currency', 'currency')
      .leftJoinAndSelect('store.ports', 'port')
      .leftJoinAndSelect('store.serviceTypes', 'serviceType')
      .where('store.status = :status', { status: 'ACTIVE' });

    // Text search
    if (params.query) {
      queryBuilder.andWhere(
        '(store.name LIKE :query OR store.description LIKE :query)',
        { query: `%${params.query}%` },
      );
    }

    // Port filter
    if (params.portIds && params.portIds.length > 0) {
      // Need to find stores that have ANY of the selected ports
      queryBuilder.andWhere('port.id IN (:...portIds)', {
        portIds: params.portIds,
      });
    }

    // Service type filter
    if (params.serviceTypeIds && params.serviceTypeIds.length > 0) {
      queryBuilder.andWhere('serviceType.id IN (:...serviceTypeIds)', {
        serviceTypeIds: params.serviceTypeIds,
      });
    }

    // Rating filter
    if (params.ratingMin) {
      queryBuilder.andWhere('store.ratingAvg >= :ratingMin', {
        ratingMin: params.ratingMin,
      });
    }

    // Price filters
    if (params.priceMin) {
      queryBuilder.andWhere('store.priceFrom >= :priceMin', {
        priceMin: params.priceMin,
      });
    }
    if (params.priceMax) {
      queryBuilder.andWhere('store.priceFrom <= :priceMax', {
        priceMax: params.priceMax,
      });
    }

    // Verified only (Assuming ACTIVE status implies basic verification for now, 
    // or add a verified flag to entity later if needed)
    // if (params.verifiedOnly) {
    //   queryBuilder.andWhere('store.isVerified = :verified', { verified: true });
    // }

    // Sorting
    const sortBy = params.sortBy || 'rating';
    switch (sortBy) {
      case 'price_asc':
        queryBuilder.orderBy('store.priceFrom', 'ASC');
        break;
      case 'price_desc':
        queryBuilder.orderBy('store.priceFrom', 'DESC');
        break;
      case 'newest':
        queryBuilder.orderBy('store.createdAt', 'DESC');
        break;
      case 'rating':
      default:
        queryBuilder.orderBy('store.ratingAvg', 'DESC').addOrderBy('store.ratingCount', 'DESC');
        break;
    }

    const [stores, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: stores,
      total,
      page,
      limit,
    };
  }

  async getStoreById(id: number) {
    return this.storeRepository.findOne({
      where: { id, status: 'ACTIVE' },
      relations: ['currency', 'ports', 'serviceTypes'],
    });
  }
}
