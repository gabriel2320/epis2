import { defineBlueprint, field, section } from '../factory.js';

export const procedureRequestBlueprint = defineBlueprint({
  blueprintId: 'procedure_request',
  label: 'Solicitud de procedimiento',
  purpose: 'Orden de procedimiento diagnóstico o terapéutico ambulatorio/hospitalario',
  intentIds: ['request_procedure'],
  allowedRoles: ['physician', 'nurse'],
  routePath: '/espacio/procedimiento',
  outputKind: 'ORDER_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('procedure', 'Procedimiento', [
      'scheduledDate',
      'procedureType',
      'procedureDescription',
      'clinicalReason',
      'priority',
    ]),
  ],
  fields: [
    field('scheduledDate', 'Fecha programada', 'date', { required: true, columnSpan: 4 }),
    field('procedureType', 'Tipo de procedimiento', 'select', {
      required: true,
      options: ['endoscopia', 'biopsia', 'cirugia_menor', 'cateterismo', 'otro'],
      columnSpan: 4,
    }),
    field('procedureDescription', 'Procedimiento solicitado', 'textarea', true),
    field('clinicalReason', 'Motivo clínico', 'textarea', true),
    field('priority', 'Prioridad', 'select', { options: ['rutina', 'urgente'], columnSpan: 4 }),
  ],
  validations: [
    { fieldId: 'scheduledDate', message: 'Indique fecha programada' },
    { fieldId: 'procedureType', message: 'Seleccione tipo de procedimiento' },
    { fieldId: 'procedureDescription', message: 'Describa el procedimiento' },
    { fieldId: 'clinicalReason', message: 'Motivo clínico requerido' },
  ],
});
