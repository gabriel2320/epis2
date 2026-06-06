import { defineBlueprint, field, section } from '../factory.js';

/** Valores alineados con CHECK patient_allergies.severity (migración 008). */
const SEVERITY_OPTIONS = ['mild', 'moderate', 'severe'] as const;

export const allergyEntryBlueprint = defineBlueprint({
  blueprintId: 'allergy_entry',
  label: 'Registro de alergia',
  purpose: 'Alta de alergia con aprobación humana antes de SoT',
  intentIds: ['summarize_patient'],
  allowedRoles: ['physician', 'nurse'],
  routePath: '/espacio/alergia',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: false,
  sections: [section('allergy', 'Alergia', ['substance', 'severity', 'reactionNotes'])],
  fields: [
    field('substance', 'Sustancia / fármaco', 'text', true),
    field('severity', 'Severidad', 'select', true, SEVERITY_OPTIONS),
    field('reactionNotes', 'Reacción y notas', 'textarea'),
  ],
  validations: [
    { fieldId: 'substance', message: 'Sustancia requerida' },
    { fieldId: 'severity', message: 'Severidad requerida' },
  ],
});
