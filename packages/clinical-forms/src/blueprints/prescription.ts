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
    field('medication', 'Medicamento', 'text', {
      required: true,
      columnSpan: 8,
      catalogAutocomplete: 'medication',
    }),
    field('dose', 'Dosis', 'text', { required: true, columnSpan: 4 }),
    field('quantity', 'Cantidad', 'text', { required: true, columnSpan: 4 }),
    field('route', 'Vía', 'select', { options: ['oral', 'intravenosa', 'topica'], columnSpan: 4 }),
    field('frequency', 'Frecuencia', 'text', { required: true, columnSpan: 4 }),
    field('duration', 'Duración del tratamiento', 'text', { required: true, columnSpan: 4 }),
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
