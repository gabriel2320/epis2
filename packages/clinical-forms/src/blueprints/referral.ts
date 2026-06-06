import { defineBlueprint, field, section } from '../factory.js';

export const referralBlueprint = defineBlueprint({
  blueprintId: 'referral',
  label: 'Interconsulta',
  purpose: 'Solicitud de interconsulta a especialidad',
  intentIds: ['request_referral'],
  allowedRoles: ['physician', 'nurse'],
  routePath: '/espacio/interconsulta',
  outputKind: 'ORDER_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('referral', 'Interconsulta', [
      'specialty',
      'clinicalSummary',
      'clinicalQuestion',
      'urgency',
    ]),
  ],
  fields: [
    field('specialty', 'Especialidad', 'text', { required: true, columnSpan: 8 }),
    field('clinicalSummary', 'Resumen clínico breve', 'textarea', true),
    field('clinicalQuestion', 'Pregunta clínica', 'textarea', true),
    field('urgency', 'Urgencia', 'select', {
      options: ['rutina', 'preferente', 'urgente'],
      columnSpan: 4,
    }),
  ],
  validations: [
    { fieldId: 'specialty', message: 'Indique la especialidad' },
    { fieldId: 'clinicalSummary', message: 'Resumen clínico requerido' },
    { fieldId: 'clinicalQuestion', message: 'Pregunta clínica requerida' },
  ],
});
