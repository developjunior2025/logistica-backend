import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { RegisterPaymentDto, RejectPaymentDto } from '../dto/payment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  register(@Body() registerDto: RegisterPaymentDto, @Request() req) {
    return this.paymentsService.register(registerDto, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('PROF-OPE-004', 'PROF-SUP-003') // Operador o Superadmin
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles('PROF-OPE-004', 'PROF-SUP-003')
  @Put(':id/validate')
  validate(@Param('id') id: string, @Request() req) {
    return this.paymentsService.validate(+id, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('PROF-OPE-004', 'PROF-SUP-003')
  @Put(':id/reject')
  reject(@Param('id') id: string, @Body() rejectDto: RejectPaymentDto, @Request() req) {
    return this.paymentsService.reject(+id, rejectDto, req.user.id);
  }
}
