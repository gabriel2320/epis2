import { defineBlueprint, field, section } from '../factory.js';

export const referralReportBlueprint = defineBlueprint({
  blueprintId: 'referral_report',
  label: 'Informe de interconsulta',
  purpose: 'Respuesta formal a solicitud de interconsulta',
  intentIds: ['respond_referral'],
  allowedRoles: ['physician'],
  routePath: '/espacio/informe-interconsulta',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('report', 'Informe', [
      'referralContext',
      'specialistAssessment',
      'recommendations',
      'followUpPlan',
    ]),
  ],
  fields: [
    field('referralContext', 'Contexto de la solicitud', 'textarea', true),
    field('specialistAssessment', 'Evaluación del especialista', 'textarea', true),
    field('recommendations', 'Recomendaciones', 'textarea', true),
    field('followUpPlan', 'Plan de seguimiento', 'textarea', false),
  ],
  validations: [
    { fieldId: 'referralContext', message: 'Contexto requerido' },
    { fieldId: 'specialistAssessment', message: 'Evaluación requerida' },
    { fieldId: 'recommendations', message: 'Recomendaciones requeridas' },
  ],
});
