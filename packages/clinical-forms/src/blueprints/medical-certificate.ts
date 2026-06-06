import { defineBlueprint, field, section } from '../factory.js';

const CERTIFICATE_TYPE_OPTIONS = [
  'reposo|Certificado de reposo',
  'asistencia|Certificado de asistencia',
  'salud|Certificado de salud / aptitud',
] as const;

export const medicalCertificateBlueprint = defineBlueprint({
  blueprintId: 'medical_certificate',
  label: 'Certificado médico',
  purpose: 'Documento legal breve para reposo, asistencia o aptitud',
  intentIds: ['create_medical_certificate'],
  allowedRoles: ['physician'],
  routePath: '/espacio/certificado',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [
    section('certificate', 'Certificado', [
      'certificateType',
      'diagnosisSummary',
      'restDays',
      'validFrom',
      'validUntil',
      'instructions',
    ]),
  ],
  fields: [
    field('certificateType', 'Tipo de certificado', 'select', {
      required: true,
      options: CERTIFICATE_TYPE_OPTIONS,
      columnSpan: 6,
    }),
    field('diagnosisSummary', 'Diagnóstico / motivo', 'textarea', true),
    field('restDays', 'Días de reposo (si aplica)', 'text', { columnSpan: 4 }),
    field('validFrom', 'Válido desde', 'date', { required: true, columnSpan: 4 }),
    field('validUntil', 'Válido hasta', 'date', { columnSpan: 4 }),
    field('instructions', 'Indicaciones al paciente', 'textarea'),
  ],
  validations: [
    { fieldId: 'certificateType', message: 'Seleccione tipo de certificado' },
    { fieldId: 'diagnosisSummary', message: 'Diagnóstico requerido' },
    { fieldId: 'validFrom', message: 'Fecha de inicio requerida' },
  ],
});
