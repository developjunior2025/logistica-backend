import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { Store } from '../stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class MarketplaceModule {}
