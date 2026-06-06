import { defineBlueprint, field, section } from '../factory.js';

/** Cama demo 102A disponible en seed V2 (MF-157). */
const DEMO_BED_OPTIONS = [
  'f0000002-0000-4000-8000-000000000003|102A — disponible',
  'f0000002-0000-4000-8000-000000000001|101A — ocupada (solo traslado)',
] as const;

export const admissionNoteBlueprint = defineBlueprint({
  blueprintId: 'admission_note',
  label: 'Nota de ingreso hospitalario',
  purpose: 'Documentar ingreso con cama destino y plan inicial',
  intentIds: ['admit_patient_hospital'],
  allowedRoles: ['physician'],
  routePath: '/espacio/ingreso',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: false,
  sections: [
    section('admission', 'Ingreso', [
      'admissionReason',
      'clinicalSummary',
      'initialPlan',
      'targetBedId',
    ]),
  ],
  fields: [
    field('admissionReason', 'Motivo de ingreso', 'textarea', true),
    field('clinicalSummary', 'Resumen clínico', 'textarea', true),
    field('initialPlan', 'Plan inicial', 'textarea', true),
    field('targetBedId', 'Cama destino', 'select', {
      required: true,
      options: DEMO_BED_OPTIONS,
      columnSpan: 6,
    }),
  ],
  validations: [
    { fieldId: 'admissionReason', message: 'Motivo de ingreso requerido' },
    { fieldId: 'clinicalSummary', message: 'Resumen clínico requerido' },
    { fieldId: 'targetBedId', message: 'Seleccione cama destino' },
  ],
});
