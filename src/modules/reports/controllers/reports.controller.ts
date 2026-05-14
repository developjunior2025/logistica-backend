import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from '../services/reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('orders/csv')
  @Roles('PROF-OPE-004', 'PROF-SUP-003')
  async exportOrders(@Query('status') status: string, @Res() res: Response) {
    const csv = await this.reportsService.exportOrdersCsv(status);
    res.header('Content-Type', 'text/csv');
    res.attachment('orders_report.csv');
    return res.send(csv);
  }

  @Get('payments/csv')
  @Roles('PROF-OPE-004', 'PROF-SUP-003')
  async exportPayments(@Res() res: Response) {
    const csv = await this.reportsService.exportPaymentsCsv();
    res.header('Content-Type', 'text/csv');
    res.attachment('payments_report.csv');
    return res.send(csv);
  }

  @Get('commissions/csv')
  @Roles('PROF-OPE-004', 'PROF-SUP-003')
  async exportCommissions(@Res() res: Response) {
    const csv = await this.reportsService.exportCommissionsCsv();
    res.header('Content-Type', 'text/csv');
    res.attachment('commissions_report.csv');
    return res.send(csv);
  }
}
