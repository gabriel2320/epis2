import { defineBlueprint, field, section } from '../factory.js';

export const patientSearchBlueprint = defineBlueprint({
  blueprintId: 'patient_search',
  label: 'Buscar paciente',
  purpose: 'Resolver y fijar paciente activo (demo sintético)',
  intentIds: ['search_patient'],
  allowedRoles: ['physician', 'nurse', 'admin', 'auditor'],
  routePath: '/espacio/buscar-paciente',
  outputKind: 'SEARCH',
  requiresPatient: false,
  requiresEncounter: false,
  approvalRequired: false,
  sections: [section('search', 'Criterios de búsqueda', ['patientName', 'identifier'])],
  fields: [
    field('patientName', 'Nombre o apellido', 'text', { columnSpan: 8 }),
    field('identifier', 'Identificador demo', 'text', { columnSpan: 4 }),
  ],
  validations: [],
});
