import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { WmsService } from '../services/wms.service';
import { CreateReceiptDto, LocateReceiptDto, CreateDispatchDto } from '../dto/wms.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('wms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WmsController {
  constructor(private readonly wmsService: WmsService) {}

  @Roles('PROF-OPE-004', 'PROF-INS-005', 'PROF-SUP-003')
  @Post('receipts')
  createReceipt(@Body() dto: CreateReceiptDto, @Request() req) {
    return this.wmsService.createReceipt(dto, req.user.id);
  }

  @Roles('PROF-OPE-004', 'PROF-INS-005', 'PROF-SUP-003')
  @Put('receipts/:id/locate')
  locate(@Param('id') id: string, @Body() dto: LocateReceiptDto, @Request() req) {
    return this.wmsService.locate(+id, dto, req.user.id);
  }

  @Roles('PROF-OPE-004', 'PROF-INS-005', 'PROF-TIE-002', 'PROF-SUP-003')
  @Get('inventory')
  findInventory(
    @Query('warehouseId') warehouseId?: string,
    @Query('status') status?: string,
  ) {
    return this.wmsService.findInventory({
      warehouseId: warehouseId ? +warehouseId : undefined,
      status,
    });
  }

  @Roles('PROF-OPE-004', 'PROF-SUP-003')
  @Post('dispatches')
  dispatch(@Body() dto: CreateDispatchDto, @Request() req) {
    return this.wmsService.dispatch(dto.receiptId, req.user.id);
  }
}
