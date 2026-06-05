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
    section('imaging', 'Estudio', ['scheduledDate', 'modality', 'studyDescription', 'clinicalIndication']),
  ],
  fields: [
    field('scheduledDate', 'Fecha programada', 'date', true),
    field('modality', 'Modalidad', 'select', true, ['RX', 'TC', 'RM', 'US', 'OTRO']),
    field('studyDescription', 'Estudio solicitado', 'textarea', true),
    field('clinicalIndication', 'Indicación clínica', 'textarea', true),
  ],
  validations: [
    { fieldId: 'scheduledDate', message: 'Indique fecha programada' },
    { fieldId: 'modality', message: 'Seleccione modalidad' },
    { fieldId: 'studyDescription', message: 'Describa el estudio' },
    { fieldId: 'clinicalIndication', message: 'Indicación requerida' },
  ],
});
