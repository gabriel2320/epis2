import { defineBlueprint, field, section } from '../factory.js';
import { PAPER_CHART_SECTION_IDS } from './schema.js';

/** Blueprint ficha papel — 7 secciones estructuradas (no PDF plano). */
export const paperChartBlueprint = defineBlueprint({
  blueprintId: 'paper_chart',
  label: 'Ficha clínica papel',
  purpose: 'Documento institucional editable Carta/A5 con secciones I–VII',
  intentIds: [],
  allowedRoles: ['physician', 'nurse'],
  routePath: '/espacio/ficha/papel',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: false,
  sections: [
    section('cover', 'I. Carátula', ['cover']),
    section('anamnesis', 'II. Anamnesis', ['anamnesis']),
    section('physicalExam', 'III. Examen físico', ['physicalExam']),
    section('orders', 'IV. Indicaciones', ['orders']),
    section('soap', 'V. Evolución SOAP', ['soap']),
    section('labs', 'VI. Laboratorio', ['labs']),
    section('discharge', 'VII. Epicrisis', ['discharge']),
  ],
  fields: PAPER_CHART_SECTION_IDS.map((id) => field(id, id, 'textarea', { clinicalTextBox: true })),
  validations: [],
});
