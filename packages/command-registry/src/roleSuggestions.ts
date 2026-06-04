import { roleHasPermission, type ClinicalRole, type Permission } from '@epis2/clinical-domain';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import type { ClinicalIntent } from './types.js';

/** Intents priorizados por rol para chips del Centro de Comando. */
export const ROLE_COMMAND_INTENTS: Record<ClinicalRole, readonly ClinicalIntent[]> = {
  physician: [
    'summarize_patient',
    'create_evolution_draft',
    'prepare_prescription',
    'request_laboratory',
    'request_referral',
    'request_imaging',
    'prepare_discharge_draft',
    'search_patient',
    'open_dashboard_work',
    'open_dashboard_patient',
  ],
  nurse: [
    'create_nursing_note',
    'record_medication_administration',
    'summarize_patient',
    'search_patient',
    'open_dashboard_work',
    'open_dashboard_patient',
  ],
  pharmacist: [
    'prepare_pharmacy_review',
    'prepare_prescription',
    'summarize_patient',
    'search_patient',
    'open_dashboard_work',
  ],
  admin: [
    'open_dashboard_quality',
    'open_dashboard',
    'open_dashboard_work',
    'open_dashboard_service',
    'search_patient',
  ],
  auditor: [
    'open_dashboard_quality',
    'open_dashboard',
    'open_dashboard_work',
  ],
};

export type RoleAiCommandHint = {
  sampleEs: string;
  captionEs: string;
};

/** Frases orientadas a IA local (asistencia en formulario / ficha, no auto-ejecución). */
export const ROLE_AI_COMMAND_HINTS: Record<ClinicalRole, readonly RoleAiCommandHint[]> = {
  physician: [
    { sampleEs: 'evoluciona al paciente', captionEs: 'Borrador SOAP con IA' },
    { sampleEs: 'resume al paciente', captionEs: 'Resumen + alertas' },
  ],
  nurse: [
    { sampleEs: 'nota de enfermeria', captionEs: 'Nota con asistencia IA' },
    { sampleEs: 'registrar mar', captionEs: 'MAR + doble chequeo' },
  ],
  pharmacist: [
    { sampleEs: 'validacion farmaceutica', captionEs: 'Revisión farmacéutica' },
    { sampleEs: 'revisar prescripcion', captionEs: 'CDS en receta' },
  ],
  admin: [
    { sampleEs: 'tablero de calidad', captionEs: 'Auditoría y ops' },
  ],
  auditor: [
    { sampleEs: 'tablero de calidad', captionEs: 'Auditoría del sistema' },
  ],
};

export function isClinicalRole(value: string): value is ClinicalRole {
  return value in ROLE_COMMAND_INTENTS;
}

export function getRoleAiCommandHints(
  role: string,
  aiAvailable: boolean,
): readonly RoleAiCommandHint[] {
  if (!aiAvailable || !isClinicalRole(role)) return [];
  return ROLE_AI_COMMAND_HINTS[role];
}

export function filterDefinitionsForRole(
  role: string,
  permissions: readonly string[],
) {
  const allowed = isClinicalRole(role) ? new Set(ROLE_COMMAND_INTENTS[role]) : null;
  return EPIS2_COMMAND_DEFINITIONS.filter((def) => {
    if (!permissions.includes(def.requiredPermission)) return false;
    if (allowed && !allowed.has(def.intent)) return false;
    if (!roleHasPermission(role as ClinicalRole, def.requiredPermission)) return false;
    return true;
  });
}
