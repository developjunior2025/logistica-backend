import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TransportService } from '../services/transport.service';
import { CreateTripDto, PodDto } from '../dto/transport.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('transport')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Roles('PROF-TRP-006', 'PROF-OPE-004', 'PROF-SUP-003')
  @Post('trips')
  createTrip(@Body() dto: CreateTripDto, @Request() req) {
    return this.transportService.createTrip(dto, req.user.id);
  }

  @Roles('PROF-TRP-006', 'PROF-OPE-004', 'PROF-SUP-003')
  @Get('trips')
  findAll() {
    return this.transportService.findAll();
  }

  @Roles('PROF-TRP-006', 'PROF-OPE-004', 'PROF-SUP-003')
  @Get('trips/:id')
  findOne(@Param('id') id: string) {
    return this.transportService.findOne(+id);
  }

  @Roles('PROF-TRP-006', 'PROF-OPE-004', 'PROF-SUP-003')
  @Put('trips/:id/start')
  startTrip(@Param('id') id: string, @Request() req) {
    return this.transportService.startTrip(+id, req.user.id);
  }

  @Roles('PROF-TRP-006', 'PROF-OPE-004', 'PROF-SUP-003')
  @Put('trips/:id/pod')
  registerPod(@Param('id') id: string, @Body() dto: PodDto, @Request() req) {
    return this.transportService.registerPod(+id, dto, req.user.id);
  }
}
