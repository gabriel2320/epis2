import { defineBlueprint, field, section } from '../factory.js';

export const labRequestBlueprint = defineBlueprint({
  blueprintId: 'lab_request',
  label: 'Solicitud de laboratorio',
  purpose: 'Orden de exámenes de laboratorio',
  intentIds: ['request_laboratory'],
  allowedRoles: ['physician', 'nurse'],
  routePath: '/espacio/laboratorio',
  outputKind: 'ORDER_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [section('order', 'Solicitud', ['scheduledDate', 'labTests', 'clinicalReason', 'priority'])],
  fields: [
    field('scheduledDate', 'Fecha programada', 'date', true),
    field('labTests', 'Exámenes', 'textarea', true),
    field('clinicalReason', 'Motivo clínico', 'textarea', true),
    field('priority', 'Prioridad', 'select', false, ['rutina', 'urgente']),
  ],
  validations: [
    { fieldId: 'scheduledDate', message: 'Indique fecha programada' },
    { fieldId: 'labTests', message: 'Indique al menos un examen' },
    { fieldId: 'clinicalReason', message: 'Motivo clínico requerido' },
  ],
});
