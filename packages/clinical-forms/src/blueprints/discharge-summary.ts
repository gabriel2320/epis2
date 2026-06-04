import { defineBlueprint, field, section } from '../factory.js';

export const dischargeSummaryBlueprint = defineBlueprint({
  blueprintId: 'discharge_summary',
  label: 'Epicrisis',
  purpose: 'Resumen de hospitalización y alta',
  intentIds: ['prepare_discharge_draft'],
  allowedRoles: ['physician'],
  routePath: '/espacio/epicrisis',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('dx', 'Diagnósticos', ['diagnoses']),
    section('stay', 'Hospitalización', ['hospitalizationSummary', 'evolution']),
    section('meds', 'Alta', ['dischargeMedications', 'instructions']),
  ],
  fields: [
    field('diagnoses', 'Diagnósticos', 'textarea', true),
    field('hospitalizationSummary', 'Resumen de hospitalización', 'textarea', true),
    field('evolution', 'Evolución', 'textarea'),
    field('dischargeMedications', 'Medicamentos al alta', 'textarea', true),
    field('instructions', 'Indicaciones', 'textarea'),
  ],
  validations: [
    { fieldId: 'diagnoses', message: 'Diagnósticos requeridos' },
    { fieldId: 'hospitalizationSummary', message: 'Resumen requerido' },
    { fieldId: 'dischargeMedications', message: 'Medicamentos al alta requeridos' },
  ],
});
