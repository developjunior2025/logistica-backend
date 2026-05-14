import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TosService } from '../services/tos.service';
import { CreateContainerDto, MoveContainerDto, GateInDto, GateOutDto } from '../dto/tos.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('tos')
@UseGuards(JwtAuthGuard)
export class TosController {
  constructor(private readonly tosService: TosService) {}

  // ── Yards ──────────────────────────────────────────────────
  @Get('yards')
  findYards() {
    return this.tosService.findYards();
  }

  // ── Containers ─────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('PROF-OPE-004', 'PROF-INS-005', 'PROF-SUP-003')
  @Post('containers')
  createContainer(@Body() dto: CreateContainerDto, @Request() req) {
    return this.tosService.createContainer(dto, req.user.id);
  }

  @Get('containers')
  findContainers(
    @Query('status') status?: string,
    @Query('zone') zone?: string,
    @Query('orderId') orderId?: string,
  ) {
    return this.tosService.findContainers({
      status,
      zone,
      orderId: orderId ? +orderId : undefined,
    });
  }

  @Get('containers/:id')
  findContainer(@Param('id') id: string) {
    return this.tosService.findContainer(+id);
  }

  @UseGuards(RolesGuard)
  @Roles('PROF-OPE-004', 'PROF-INS-005', 'PROF-SUP-003')
  @Put('containers/:id/move')
  moveContainer(@Param('id') id: string, @Body() dto: MoveContainerDto, @Request() req) {
    return this.tosService.moveContainer(+id, dto, req.user.id);
  }

  // ── Gate Events ────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('PROF-OPE-004', 'PROF-INS-005', 'PROF-SUP-003')
  @Post('gate/in')
  gateIn(@Body() dto: GateInDto, @Request() req) {
    return this.tosService.gateIn(dto, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('PROF-OPE-004', 'PROF-INS-005', 'PROF-SUP-003')
  @Post('gate/out')
  gateOut(@Body() dto: GateOutDto, @Request() req) {
    return this.tosService.gateOut(dto, req.user.id);
  }
}
