import { defineBlueprint, field, section } from '../factory.js';

const ICD10_DEMO_OPTIONS = [
  'J06.9|Infección aguda vías respiratorias superiores',
  'I10|Hipertensión esencial',
  'E11.9|Diabetes mellitus tipo 2',
  'M54.5|Lumbalgia',
  'Z00.0|Examen médico general',
] as const;

export const outpatientVisitBlueprint = defineBlueprint({
  blueprintId: 'outpatient_visit',
  label: 'Consulta ambulatoria',
  purpose: 'Atención ambulatoria con anamnesis, examen, diagnóstico y cierre de episodio',
  intentIds: ['create_outpatient_visit'],
  allowedRoles: ['physician', 'nurse'],
  routePath: '/espacio/ambulatorio',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('anamnesis', 'Anamnesis', ['chiefComplaint', 'history'], 'visible'),
    section(
      'vitals',
      'Signos vitales y antropometría',
      ['bloodPressure', 'heartRate', 'temperature', 'weightKg', 'heightCm'],
      'collapsed',
    ),
    section('physical-general', 'Examen físico general', ['physicalExamGeneral'], 'collapsed'),
    section('physical-segment', 'Examen físico segmentario', ['physicalExamSegment'], 'collapsed'),
    section('diagnosis', 'Diagnóstico', ['icd10Code', 'assessment'], 'visible'),
    section('plan', 'Plan e indicaciones', ['plan', 'generalIndications'], 'visible'),
    section(
      'closure',
      'Cierre de episodio',
      ['closeEncounter', 'patientSummaryForPatient'],
      'collapsed',
    ),
  ],
  fields: [
    field('chiefComplaint', 'Motivo de consulta', 'textarea', true),
    field('history', 'Anamnesis próxima', 'textarea', true),
    field('bloodPressure', 'Presión arterial (mmHg)', 'text', { columnSpan: 4 }),
    field('heartRate', 'Frecuencia cardíaca (lpm)', 'text', { columnSpan: 4 }),
    field('temperature', 'Temperatura (°C)', 'text', { columnSpan: 4 }),
    field('weightKg', 'Peso (kg)', 'text', { columnSpan: 6 }),
    field('heightCm', 'Talla (cm)', 'text', { columnSpan: 6 }),
    field('physicalExamGeneral', 'Examen físico general', 'textarea'),
    field('physicalExamSegment', 'Examen por aparatos', 'textarea'),
    field('icd10Code', 'Diagnóstico CIE-10', 'select', {
      required: false,
      options: ICD10_DEMO_OPTIONS,
      columnSpan: 6,
    }),
    field('assessment', 'Evaluación clínica', 'textarea', true),
    field('plan', 'Plan terapéutico', 'textarea', true),
    field('generalIndications', 'Indicaciones generales (reposo, dieta, controles)', 'textarea'),
    field('closeEncounter', 'Marcar episodio para cierre al aprobar', 'checkbox', { columnSpan: 6 }),
    field(
      'patientSummaryForPatient',
      'Resumen para el paciente (legible, sin jerga)',
      'textarea',
    ),
  ],
  validations: [
    { fieldId: 'chiefComplaint', message: 'Motivo de consulta requerido' },
    { fieldId: 'history', message: 'Anamnesis requerida' },
    { fieldId: 'assessment', message: 'Evaluación requerida' },
    { fieldId: 'plan', message: 'Plan requerido' },
  ],
});
