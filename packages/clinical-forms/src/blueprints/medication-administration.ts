import { defineBlueprint, field, section } from '../factory.js';

export const medicationAdministrationBlueprint = defineBlueprint({
  blueprintId: 'medication_administration',
  label: 'Administración (MAR)',
  purpose: 'Registro de administración de medicamento con doble chequeo demo',
  intentIds: ['record_medication_administration'],
  allowedRoles: ['nurse', 'physician'],
  routePath: '/espacio/mar',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('mar', 'MAR', [
      'medication',
      'dose',
      'route',
      'scheduledTime',
      'administeredAt',
      'doubleCheckConfirmed',
      'administrationNotes',
    ]),
  ],
  fields: [
    field('medication', 'Medicamento', 'text', true),
    field('dose', 'Dosis', 'text', true),
    field('route', 'Vía', 'text', true),
    field('scheduledTime', 'Hora programada', 'text', false),
    field('administeredAt', 'Hora de administración', 'text', false),
    field(
      'doubleCheckConfirmed',
      'Doble chequeo confirmado (alto riesgo)',
      'checkbox',
      false,
    ),
    field('administrationNotes', 'Notas de administración', 'textarea', false),
  ],
  validations: [
    { fieldId: 'medication', message: 'Medicamento requerido' },
    { fieldId: 'dose', message: 'Dosis requerida' },
    { fieldId: 'route', message: 'Vía requerida' },
  ],
});
