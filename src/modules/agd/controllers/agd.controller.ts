import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AgdService } from '../services/agd.service';
import { CreateCertificateDto, CreatePledgeDto } from '../dto/agd.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('agd')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgdController {
  constructor(private readonly agdService: AgdService) {}

  @Roles('PROF-AGA-007', 'PROF-SUP-003')
  @Post('certificates')
  issueCertificate(@Body() dto: CreateCertificateDto, @Request() req) {
    return this.agdService.issueCertificate(dto, req.user.id);
  }

  @Roles('PROF-AGA-007', 'PROF-SUP-003')
  @Get('certificates')
  findAll() {
    return this.agdService.findAll();
  }

  @Roles('PROF-AGA-007', 'PROF-TIE-002', 'PROF-SUP-003')
  @Get('certificates/:id')
  findOne(@Param('id') id: string) {
    return this.agdService.findOne(+id);
  }

  @Roles('PROF-AGA-007', 'PROF-SUP-003')
  @Post('certificates/:id/pledge')
  createPledge(@Param('id') id: string, @Body() dto: CreatePledgeDto, @Request() req) {
    return this.agdService.createPledge(+id, dto, req.user.id);
  }
}
