import { defineBlueprint, field, section } from '../factory.js';

export const medicationReconciliationBlueprint = defineBlueprint({
  blueprintId: 'medication_reconciliation',
  label: 'Conciliación medicamentosa',
  purpose: 'Documentar conciliación entre medicamentos domiciliarios e hospitalarios',
  intentIds: ['reconcile_medications'],
  allowedRoles: ['pharmacist', 'physician'],
  routePath: '/espacio/conciliacion',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: false,
  sections: [
    section('reconciliation', 'Conciliación', [
      'homeMedications',
      'inpatientMedications',
      'discrepancies',
      'resolutionPlan',
      'communicationNotes',
    ]),
  ],
  fields: [
    field('homeMedications', 'Medicamentos domiciliarios', 'textarea', true),
    field('inpatientMedications', 'Medicamentos hospitalarios', 'textarea', true),
    field('discrepancies', 'Discrepancias identificadas', 'textarea', true),
    field('resolutionPlan', 'Plan de conciliación', 'textarea', true),
    field('communicationNotes', 'Comunicación al equipo', 'textarea', false),
  ],
  validations: [
    { fieldId: 'homeMedications', message: 'Indique medicamentos domiciliarios' },
    { fieldId: 'inpatientMedications', message: 'Indique medicamentos hospitalarios' },
    { fieldId: 'discrepancies', message: 'Describa discrepancias' },
    { fieldId: 'resolutionPlan', message: 'Plan de conciliación requerido' },
  ],
});
