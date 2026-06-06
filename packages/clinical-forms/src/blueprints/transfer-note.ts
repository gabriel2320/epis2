import { defineBlueprint, field, section } from '../factory.js';

const DEMO_TRANSFER_BEDS = [
  'f0000002-0000-4000-8000-000000000003|102A — disponible',
] as const;

export const transferNoteBlueprint = defineBlueprint({
  blueprintId: 'transfer_note',
  label: 'Nota de traslado',
  purpose: 'Documentar traslado de cama con aprobación humana',
  intentIds: ['transfer_patient'],
  allowedRoles: ['physician', 'nurse'],
  routePath: '/espacio/traslado',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: false,
  sections: [
    section('transfer', 'Traslado', [
      'transferReason',
      'clinicalSummary',
      'handoffPlan',
      'targetBedId',
    ]),
  ],
  fields: [
    field('transferReason', 'Motivo del traslado', 'textarea', true),
    field('clinicalSummary', 'Resumen clínico', 'textarea', true),
    field('handoffPlan', 'Plan de traslado / continuidad', 'textarea', true),
    field('targetBedId', 'Cama destino', 'select', true, DEMO_TRANSFER_BEDS),
  ],
  validations: [
    { fieldId: 'transferReason', message: 'Motivo del traslado requerido' },
    { fieldId: 'clinicalSummary', message: 'Resumen clínico requerido' },
    { fieldId: 'targetBedId', message: 'Seleccione cama destino' },
  ],
});
