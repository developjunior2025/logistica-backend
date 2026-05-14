import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CancelOrderDto } from '../dto/order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Request() req) {
    const user = req.user;
    if (user.role === 'PROF-TIE-002') {
      return this.ordersService.findAllForStore(user.storeId);
    }
    return this.ordersService.findAllForClient(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles('PROF-TIE-002', 'PROF-SUP-003')
  @Put(':id/confirm')
  confirm(@Param('id') id: string, @Request() req) {
    return this.ordersService.confirm(+id, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('PROF-TIE-002', 'PROF-SUP-003')
  @Put(':id/in-progress')
  startProgress(@Param('id') id: string, @Request() req) {
    return this.ordersService.startProgress(+id, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('PROF-TIE-002', 'PROF-SUP-003')
  @Put(':id/complete')
  complete(@Param('id') id: string, @Request() req) {
    return this.ordersService.complete(+id, req.user.id);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id: string, @Body() cancelDto: CancelOrderDto, @Request() req) {
    return this.ordersService.cancel(+id, cancelDto, req.user.id);
  }
}
