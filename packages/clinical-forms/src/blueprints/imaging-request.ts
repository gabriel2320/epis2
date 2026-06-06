import { defineBlueprint, field, section } from '../factory.js';

export const imagingRequestBlueprint = defineBlueprint({
  blueprintId: 'imaging_request',
  label: 'Imagenología',
  purpose: 'Solicitud de estudio de imagen',
  intentIds: ['request_imaging'],
  allowedRoles: ['physician', 'nurse'],
  routePath: '/espacio/imagenologia',
  outputKind: 'ORDER_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('imaging', 'Estudio', [
      'scheduledDate',
      'modality',
      'studyDescription',
      'clinicalIndication',
      'priority',
    ]),
  ],
  fields: [
    field('scheduledDate', 'Fecha programada', 'date', { required: true, columnSpan: 4 }),
    field('modality', 'Modalidad', 'select', {
      required: true,
      options: ['RX', 'TC', 'RM', 'US', 'OTRO'],
      columnSpan: 4,
    }),
    field('studyDescription', 'Estudio solicitado', 'textarea', true),
    field('clinicalIndication', 'Indicación clínica', 'textarea', true),
    field('priority', 'Prioridad', 'select', { options: ['rutina', 'urgente'], columnSpan: 4 }),
  ],
  validations: [
    { fieldId: 'scheduledDate', message: 'Indique fecha programada' },
    { fieldId: 'modality', message: 'Seleccione modalidad' },
    { fieldId: 'studyDescription', message: 'Describa el estudio' },
    { fieldId: 'clinicalIndication', message: 'Indicación requerida' },
  ],
});
