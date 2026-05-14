import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { QuotationsService } from '../services/quotations.service';
import { 
  CreateQuotationDto, 
  RespondQuotationDto, 
  RejectQuotationDto, 
  RevisionQuotationDto 
} from '../dto/quotation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('quotations')
@UseGuards(JwtAuthGuard)
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  create(@Body() createQuotationDto: CreateQuotationDto, @Request() req) {
    return this.quotationsService.create(createQuotationDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    const user = req.user;
    // Un Store ve las cotizaciones de su tienda
    if (user.role === 'PROF-TIE-002') {
      return this.quotationsService.findAllForStore(user.storeId);
    }
    // Un cliente ve sus propias solicitudes
    return this.quotationsService.findAllForClient(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(+id);
  }

  // Tienda responde
  @UseGuards(RolesGuard)
  @Roles('PROF-TIE-002', 'PROF-SUP-003')
  @Post(':id/respond')
  respond(@Param('id') id: string, @Body() respondDto: RespondQuotationDto, @Request() req) {
    return this.quotationsService.respond(+id, respondDto, req.user.id);
  }

  // Cliente aprueba
  @Post(':id/approve')
  approve(@Param('id') id: string, @Request() req) {
    return this.quotationsService.approve(+id, req.user.id);
  }

  // Cliente rechaza
  @Post(':id/reject')
  reject(@Param('id') id: string, @Body() rejectDto: RejectQuotationDto, @Request() req) {
    return this.quotationsService.reject(+id, rejectDto, req.user.id);
  }

  // Cliente solicita revision
  @Post(':id/request-revision')
  requestRevision(@Param('id') id: string, @Body() revisionDto: RevisionQuotationDto, @Request() req) {
    return this.quotationsService.requestRevision(+id, revisionDto, req.user.id);
  }
}
