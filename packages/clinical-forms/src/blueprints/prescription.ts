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
  sections: [section('rx', 'Prescripción', ['medication', 'dose', 'route', 'frequency', 'duration'])],
  fields: [
    field('medication', 'Medicamento', 'text', true),
    field('dose', 'Dosis', 'text', true),
    field('route', 'Vía', 'select', false, ['oral', 'intravenosa', 'topica']),
    field('frequency', 'Frecuencia', 'text', true),
    field('duration', 'Duración', 'text', true),
  ],
  validations: [
    { fieldId: 'medication', message: 'Medicamento requerido' },
    { fieldId: 'dose', message: 'Dosis requerida' },
    { fieldId: 'frequency', message: 'Frecuencia requerida' },
    { fieldId: 'duration', message: 'Duración requerida' },
  ],
});
