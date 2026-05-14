import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import { CreateStoreServiceDto, UpdateStoreServiceDto } from '../dto/service.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('stores/:storeId/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROF-TIE-002', 'PROF-SUP-003')
  @Post()
  create(
    @Param('storeId') storeId: string,
    @Body() createServiceDto: CreateStoreServiceDto,
    @Request() req
  ) {
    return this.servicesService.create(+storeId, createServiceDto, req.user.id);
  }

  @Get()
  findAll(@Param('storeId') storeId: string) {
    return this.servicesService.findAllByStore(+storeId);
  }

  @Get(':serviceId')
  findOne(@Param('serviceId') serviceId: string) {
    return this.servicesService.findOne(+serviceId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROF-TIE-002', 'PROF-SUP-003')
  @Patch(':serviceId')
  update(
    @Param('serviceId') serviceId: string,
    @Body() updateServiceDto: UpdateStoreServiceDto,
    @Request() req
  ) {
    return this.servicesService.update(+serviceId, updateServiceDto, req.user.id);
  }
}
