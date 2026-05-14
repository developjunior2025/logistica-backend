import { SetMetadata } from '@nestjs/common';
import { TAuditLevel } from '../entities/audit-log.entity';

export const AUDITABLE_KEY = 'auditable';

export interface IAuditableMeta {
  level: TAuditLevel;
  description: string;
  entityType: string;
}

/**
 * @Auditable() decorator — marks an endpoint to trigger audit logging.
 * Usage: @Auditable({ level: 'CRITICAL', description: 'Gate-out registered', entityType: 'Container' })
 */
export const Auditable = (meta: IAuditableMeta) =>
  SetMetadata(AUDITABLE_KEY, meta);
