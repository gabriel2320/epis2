import { defineBlueprint, field, section } from '../factory.js';

export const nursingNoteBlueprint = defineBlueprint({
  blueprintId: 'nursing_note',
  label: 'Nota de enfermería',
  purpose: 'Registro de cuidados y vigilancia',
  intentIds: ['create_nursing_note'],
  allowedRoles: ['nurse', 'physician'],
  routePath: '/espacio/enfermeria',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('vitals', 'Signos', ['bloodPressure', 'heartRate', 'oxygenSaturation', 'temperature']),
    section('note', 'Nota', ['careProvided', 'patientResponse', 'observations']),
  ],
  fields: [
    field('bloodPressure', 'Presión arterial', 'text', false),
    field('heartRate', 'Frecuencia cardiaca', 'text', false),
    field('oxygenSaturation', 'SatO2 (%)', 'text', false),
    field('temperature', 'Temperatura (°C)', 'text', false),
    field('careProvided', 'Cuidados realizados', 'textarea', true),
    field('patientResponse', 'Respuesta del paciente', 'textarea', false),
    field('observations', 'Observaciones adicionales', 'textarea', false),
  ],
  validations: [{ fieldId: 'careProvided', message: 'Describa los cuidados' }],
});
