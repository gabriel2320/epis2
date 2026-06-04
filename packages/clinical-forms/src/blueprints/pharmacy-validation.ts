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
  sections: [section('pharm', 'Farmacia', ['medicationReviewed', 'intervention', 'recommendation'])],
  fields: [
    field('medicationReviewed', 'Medicamento revisado', 'text', true),
    field('intervention', 'Tipo de intervención', 'select', true, [
      'sin_intervencion',
      'ajuste_dosis',
      'sustitucion',
      'alerta_clinica',
    ]),
    field('recommendation', 'Recomendación', 'textarea', true),
  ],
  validations: [
    { fieldId: 'medicationReviewed', message: 'Indique el medicamento' },
    { fieldId: 'recommendation', message: 'Recomendación requerida' },
  ],
});
