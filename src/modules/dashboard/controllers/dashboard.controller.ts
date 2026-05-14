import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('client')
  @Roles('PROF-CLI-001')
  getClientMetrics(@Request() req) {
    return this.dashboardService.getClientMetrics(req.user.id);
  }

  @Get('store')
  @Roles('PROF-TIE-002')
  getStoreMetrics(@Request() req) {
    return this.dashboardService.getStoreMetrics(req.user.id);
  }

  @Get('admin')
  @Roles('PROF-OPE-004', 'PROF-SUP-003')
  getAdminMetrics() {
    return this.dashboardService.getAdminMetrics();
  }
}
