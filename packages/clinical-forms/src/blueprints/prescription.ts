import { defineBlueprint, field, section } from '../factory.js';

export const prescriptionBlueprint = defineBlueprint({
  blueprintId: 'prescription',
  label: 'Receta médica',
  purpose: 'Prescripción con revisión humana',
  intentIds: ['prepare_prescription'],
  allowedRoles: ['physician', 'pharmacist'],
  routePath: '/espacio/receta',
  outputKind: 'ORDER_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('rx', 'Prescripción', [
      'medication',
      'dose',
      'quantity',
      'route',
      'frequency',
      'duration',
    ]),
    section('instructions', 'Indicaciones', ['patientInstructions', 'clinicalNotes']),
  ],
  fields: [
    field('medication', 'Medicamento', 'text', true),
    field('dose', 'Dosis', 'text', true),
    field('quantity', 'Cantidad', 'text', true),
    field('route', 'Vía', 'select', false, ['oral', 'intravenosa', 'topica']),
    field('frequency', 'Frecuencia', 'text', true),
    field('duration', 'Duración del tratamiento', 'text', true),
    field('patientInstructions', 'Indicaciones al paciente', 'textarea', true),
    field('clinicalNotes', 'Notas clínicas (internas)', 'textarea', false),
  ],
  validations: [
    { fieldId: 'medication', message: 'Medicamento requerido' },
    { fieldId: 'dose', message: 'Dosis requerida' },
    { fieldId: 'quantity', message: 'Cantidad requerida' },
    { fieldId: 'frequency', message: 'Frecuencia requerida' },
    { fieldId: 'duration', message: 'Duración requerida' },
    { fieldId: 'patientInstructions', message: 'Indicaciones al paciente requeridas' },
  ],
});
