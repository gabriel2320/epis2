import { validateRut } from '@epis2/clinical-domain';

export const CHILE_PREVISION_TYPES = [
  'FONASA',
  'ISAPRE',
  'DIPRECA',
  'CAPREDENA',
  'PARTICULAR',
] as const;

export type ChilePrevisionType = (typeof CHILE_PREVISION_TYPES)[number];

export type AdminFieldValidation = {
  valid: boolean;
  message?: string;
};

/** MF-DI-09 — validación determinística de RUT admin (sin escribir SoT). */
export function validateAdminRut(value: string): AdminFieldValidation {
  const trimmed = value.trim();
  if (!trimmed) return { valid: true };
  const compact = trimmed.replace(/\./g, '').replace(/\s/g, '');
  const looksLikeRut =
    /-\d$/.test(compact) || /-\d[kK]$/.test(compact) || /^\d{7,8}[\dkK]$/.test(compact);
  if (!looksLikeRut) return { valid: true };
  const result = validateRut(trimmed);
  if (result.valid) return { valid: true };
  return { valid: false, message: result.error ?? 'RUT inválido' };
}

/** MF-DI-09 — previsión chilena en formularios admin/demo. */
export function validateAdminPrevision(value: string): AdminFieldValidation {
  const normalized = value.trim().toUpperCase();
  if (!normalized) return { valid: true };
  const known = CHILE_PREVISION_TYPES.some((tipo) => normalized.includes(tipo));
  return known
    ? { valid: true }
    : { valid: false, message: 'Previsión no reconocida (FONASA, ISAPRE, …)' };
}
