import { defineBlueprint, field, section } from '../factory.js';

const PROBLEM_CATEGORY_OPTIONS = ['active_problem|Problema clínico activo', 'surgical_history|Antecedente quirúrgico'] as const;

export const clinicalProblemEntryBlueprint = defineBlueprint({
  blueprintId: 'clinical_problem_entry',
  label: 'Problema clínico activo',
  purpose: 'Alta de problema activo o antecedente quirúrgico con aprobación humana',
  intentIds: ['summarize_patient'],
  allowedRoles: ['physician'],
  routePath: '/espacio/problema',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: false,
  sections: [section('problem', 'Problema', ['problemCategory', 'description', 'status'])],
  fields: [
    field('problemCategory', 'Tipo de registro', 'select', {
      required: true,
      options: PROBLEM_CATEGORY_OPTIONS,
      columnSpan: 6,
    }),
    field('description', 'Descripción del problema', 'textarea', true),
    field('status', 'Estado', 'select', {
      required: true,
      options: ['active', 'resolved'] as const,
      columnSpan: 4,
    }),
  ],
  validations: [
    { fieldId: 'problemCategory', message: 'Seleccione tipo de registro' },
    { fieldId: 'description', message: 'Descripción requerida' },
  ],
});
