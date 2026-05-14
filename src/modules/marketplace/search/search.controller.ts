import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('stores')
  async searchStores(
    @Query('query') query?: string,
    @Query('portIds') portIds?: string,
    @Query('serviceTypeIds') serviceTypeIds?: string,
    @Query('ratingMin') ratingMin?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('verifiedOnly') verifiedOnly?: string,
    @Query('sortBy') sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'newest',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parseIds = (val?: string) =>
      val ? val.split(',').map(Number).filter((n) => !isNaN(n)) : undefined;

    return this.searchService.searchStores({
      query,
      portIds: parseIds(portIds),
      serviceTypeIds: parseIds(serviceTypeIds),
      ratingMin: ratingMin ? Number(ratingMin) : undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      verifiedOnly: verifiedOnly === 'true',
      sortBy,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('stores/:id')
  async getStoreById(@Param('id') id: string) {
    const store = await this.searchService.getStoreById(Number(id));
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }
}
