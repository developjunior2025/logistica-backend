import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CommissionsService } from '../services/commissions.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('commissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Roles('PROF-SUP-003', 'PROF-OPE-004') // Admins/Operators only
  @Get()
  findAll() {
    return this.commissionsService.findAll();
  }

  @Roles('PROF-SUP-003', 'PROF-OPE-004')
  @Put(':id/settle')
  settle(@Param('id') id: string) {
    return this.commissionsService.settle(+id);
  }
}
