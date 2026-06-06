import { defineBlueprint, field, section } from '../factory.js';

export const clinicalProblemEntryBlueprint = defineBlueprint({
  blueprintId: 'clinical_problem_entry',
  label: 'Problema clínico activo',
  purpose: 'Alta de problema activo con aprobación humana',
  intentIds: ['summarize_patient'],
  allowedRoles: ['physician'],
  routePath: '/espacio/problema',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: false,
  sections: [section('problem', 'Problema', ['description', 'status'])],
  fields: [
    field('description', 'Descripción del problema', 'textarea', true),
    field('status', 'Estado', 'select', {
      required: true,
      options: ['active', 'resolved'] as const,
      columnSpan: 4,
    }),
  ],
  validations: [{ fieldId: 'description', message: 'Descripción requerida' }],
});
