import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, TAuditAction, TAuditLevel } from '../entities/audit-log.entity';

export interface IAuditContext {
  userId?: number;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ILogParams {
  context?: IAuditContext;
  entityType: string;
  entityId?: number;
  action: TAuditAction;
  level?: TAuditLevel;
  description?: string;
  previousValue?: object;
  newValue?: object;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async log(params: ILogParams): Promise<AuditLog> {
    const entry = this.auditRepository.create({
      userId: params.context?.userId,
      userRole: params.context?.userRole,
      ipAddress: params.context?.ipAddress,
      userAgent: params.context?.userAgent,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      level: params.level ?? 'LOW',
      description: params.description,
      previousValue: params.previousValue,
      newValue: params.newValue,
    });

    return this.auditRepository.save(entry);
  }

  async findByEntity(entityType: string, entityId: number) {
    return this.auditRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number) {
    return this.auditRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findCritical() {
    return this.auditRepository.find({
      where: { level: 'CRITICAL' },
      order: { createdAt: 'DESC' },
    });
  }
}
