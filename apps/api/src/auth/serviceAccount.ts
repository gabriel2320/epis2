import type { SessionClaims } from './sessionToken.js';

/** Cuenta de servicio read-only para integraciones piloto (ADR-006). */
export const PILOT_SERVICE_AUDITOR_SESSION: SessionClaims = {
  sub: 'usr-auditor-01',
  username: 'auditor.demo',
  displayName: 'Auditor Demo (servicio)',
  role: 'auditor',
};

export const SERVICE_API_KEY_HEADER = 'x-epis2-service-key';
