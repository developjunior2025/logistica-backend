import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from '../entities/certificate.entity';
import { Pledge } from '../entities/pledge.entity';
import { CreateCertificateDto, CreatePledgeDto } from '../dto/agd.dto';
import { Receipt } from '../../wms/entities/receipt.entity';
import { User } from '../../auth/entities/user.entity';
import { AuditService } from '../../audit/services/audit.service';

@Injectable()
export class AgdService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certRepo: Repository<Certificate>,
    @InjectRepository(Pledge)
    private readonly pledgeRepo: Repository<Pledge>,
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly auditService: AuditService,
  ) {}

  private generateFolio(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CD-${ts}-${rand}`;
  }

  async issueCertificate(dto: CreateCertificateDto, userId: number) {
    const receipt = await this.receiptRepo.findOne({
      where: { id: dto.receiptId },
      relations: ['order'],
    });

    if (!receipt) throw new NotFoundException('Receipt not found');
    if (receipt.status !== 'LOCATED') {
      throw new UnprocessableEntityException(
        'Receipt must be LOCATED in warehouse before issuing a Certificate',
      );
    }

    const issuedBy = await this.userRepo.findOne({ where: { id: userId } });
    if (!issuedBy) throw new NotFoundException('User not found');

    const cert = this.certRepo.create({
      folio: this.generateFolio(),
      receipt,
      issuedBy,
      declaredValue: dto.declaredValue,
      description: dto.description,
      issuedAt: new Date(),
      expiresAt: new Date(dto.expiresAt),
      status: 'CD_ACTIVE',
    });

    const saved = await this.certRepo.save(cert);

    await this.auditService.log({
      context: { userId },
      entityType: 'Certificate',
      entityId: saved.id,
      action: 'CERTIFICATE_ISSUED',
      level: 'CRITICAL',
      description: `Certificate ${saved.folio} issued for Receipt #${receipt.id}`,
      newValue: { folio: saved.folio, declaredValue: dto.declaredValue },
    });

    return saved;
  }

  async createPledge(certId: number, dto: CreatePledgeDto, userId: number) {
    const cert = await this.certRepo.findOne({ where: { id: certId } });
    if (!cert) throw new NotFoundException('Certificate not found');

    if (cert.status !== 'CD_ACTIVE') {
      throw new UnprocessableEntityException('Certificate must be CD_ACTIVE to create a pledge');
    }

    const pledge = this.pledgeRepo.create({
      certificate: cert,
      financialInstitution: dto.financialInstitution,
      creditAmount: dto.creditAmount,
      interestRate: dto.interestRate,
      pledgeExpiresAt: new Date(dto.pledgeExpiresAt),
      status: 'PLEDGE_ACTIVE',
    });

    cert.status = 'CD_PLEDGED';
    await this.certRepo.save(cert);
    const savedPledge = await this.pledgeRepo.save(pledge);

    await this.auditService.log({
      context: { userId },
      entityType: 'Certificate',
      entityId: certId,
      action: 'PLEDGE_CREATED',
      level: 'CRITICAL',
      description: `Pledge created on CD ${cert.folio} for ${dto.financialInstitution}`,
      newValue: { pledgeId: savedPledge.id, creditAmount: dto.creditAmount },
    });

    // Block TOS container if linked
    // NOTE: Container block propagation could be done via an event emitter in production

    return savedPledge;
  }

  async findAll() {
    return this.certRepo.find({ relations: ['receipt', 'issuedBy'] });
  }

  async findOne(id: number) {
    const cert = await this.certRepo.findOne({
      where: { id },
      relations: ['receipt', 'issuedBy'],
    });
    if (!cert) throw new NotFoundException('Certificate not found');
    return cert;
  }
}
