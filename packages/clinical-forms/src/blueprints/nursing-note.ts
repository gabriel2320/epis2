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
    field('bloodPressure', 'Presión arterial', 'text', { columnSpan: 3 }),
    field('heartRate', 'Frecuencia cardiaca', 'text', { columnSpan: 3 }),
    field('oxygenSaturation', 'SatO2 (%)', 'text', { columnSpan: 3 }),
    field('temperature', 'Temperatura (°C)', 'text', { columnSpan: 3 }),
    field('careProvided', 'Cuidados realizados', 'textarea', { required: true, clinicalTextBox: true }),
    field('patientResponse', 'Respuesta del paciente', 'textarea', { clinicalTextBox: true }),
    field('observations', 'Observaciones adicionales', 'textarea', { clinicalTextBox: true }),
  ],
  validations: [{ fieldId: 'careProvided', message: 'Describa los cuidados' }],
});
