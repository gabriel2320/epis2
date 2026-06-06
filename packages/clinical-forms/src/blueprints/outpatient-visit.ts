import { defineBlueprint, field, section } from '../factory.js';

export const outpatientVisitBlueprint = defineBlueprint({
  blueprintId: 'outpatient_visit',
  label: 'Consulta ambulatoria',
  purpose: 'Atención ambulatoria con evaluación y plan',
  intentIds: ['create_outpatient_visit'],
  allowedRoles: ['physician', 'nurse'],
  routePath: '/espacio/ambulatorio',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('visit', 'Consulta', [
      'chiefComplaint',
      'history',
      'physicalExam',
      'assessment',
      'plan',
    ]),
  ],
  fields: [
    field('chiefComplaint', 'Motivo de consulta', 'textarea', true),
    field('history', 'Historia relevante', 'textarea', true),
    field('physicalExam', 'Examen físico', 'textarea', false),
    field('assessment', 'Evaluación', 'textarea', true),
    field('plan', 'Plan', 'textarea', true),
  ],
  validations: [
    { fieldId: 'chiefComplaint', message: 'Motivo de consulta requerido' },
    { fieldId: 'assessment', message: 'Evaluación requerida' },
    { fieldId: 'plan', message: 'Plan requerido' },
  ],
});
