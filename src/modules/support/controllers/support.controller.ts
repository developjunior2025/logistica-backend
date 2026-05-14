import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SupportService } from '../services/support.service';
import { CreateTicketDto, CreateMessageDto } from '../dto/support.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('support')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  createTicket(@Body() dto: CreateTicketDto, @Request() req) {
    return this.supportService.createTicket(dto, req.user.id);
  }

  @Get('tickets/my')
  findMyTickets(@Request() req) {
    return this.supportService.findMyTickets(req.user.id);
  }

  @Get('tickets')
  @Roles('PROF-OPE-004', 'PROF-SUP-003')
  findAllTickets() {
    return this.supportService.findAllTickets();
  }

  @Get('tickets/:id')
  getTicketDetails(@Param('id') id: string) {
    return this.supportService.getTicketDetails(+id);
  }

  @Put('tickets/:id/assign')
  @Roles('PROF-OPE-004', 'PROF-SUP-003')
  assignTicket(@Param('id') id: string, @Request() req) {
    return this.supportService.assignTicket(+id, req.user.id);
  }

  @Post('tickets/:id/messages')
  addMessage(@Param('id') id: string, @Body() dto: CreateMessageDto, @Request() req) {
    return this.supportService.addMessage(+id, dto, req.user.id);
  }
}
