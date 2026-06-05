import { defineBlueprint, field, section } from '../factory.js';

export const pharmacyValidationBlueprint = defineBlueprint({
  blueprintId: 'pharmacy_validation',
  label: 'Validación farmacéutica',
  purpose: 'Intervención o validación de prescripción (demo)',
  intentIds: ['prepare_pharmacy_review'],
  allowedRoles: ['pharmacist', 'physician'],
  routePath: '/espacio/farmacia',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: false,
  sections: [
    section('pharm', 'Farmacia', [
      'medicationReviewed',
      'prescribedDose',
      'intervention',
      'recommendation',
      'communicationToPrescriber',
    ]),
  ],
  fields: [
    field('medicationReviewed', 'Medicamento revisado', 'text', true),
    field('prescribedDose', 'Dosis prescrita', 'text', true),
    field('intervention', 'Tipo de intervención', 'select', true, [
      'sin_intervencion',
      'ajuste_dosis',
      'sustitucion',
      'alerta_clinica',
    ]),
    field('recommendation', 'Recomendación farmacéutica', 'textarea', true),
    field('communicationToPrescriber', 'Comunicación al prescriptor', 'textarea', false),
  ],
  validations: [
    { fieldId: 'medicationReviewed', message: 'Indique el medicamento' },
    { fieldId: 'prescribedDose', message: 'Indique la dosis prescrita' },
    { fieldId: 'recommendation', message: 'Recomendación requerida' },
  ],
});
