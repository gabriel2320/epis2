import type { Database } from '../db/client.js';
import { getPatientLongitudinal } from './longitudinal.js';
import { getPatientById } from './service.js';

export async function buildPatientSummaryExport(db: Database, patientId: string) {
  const patient = await getPatientById(db, patientId);
  if (!patient) return null;

  const longitudinal = await getPatientLongitudinal(db, patientId);
  const lines: string[] = [
    'EPIS2 — Resumen clínico (demo, no firmado)',
    `Paciente: ${patient.displayName}`,
    `ID: ${patientId}`,
    `Generado: ${new Date().toISOString()}`,
    '',
    '== Problemas activos ==',
    ...longitudinal.problems
      .filter((p) => p.status === 'active')
      .map((p) => `- ${p.description}`),
    '',
    '== Alergias ==',
    ...longitudinal.allergies.map((a) => `- ${a.substance} (${a.severity})`),
    '',
    '== Medicación activa ==',
    ...longitudinal.medications
      .filter((m) => m.status === 'active')
      .map((m) => `- ${m.name}${m.doseText ? ` — ${m.doseText}` : ''}`),
    '',
    '== Observaciones recientes ==',
    ...longitudinal.observations.slice(0, 8).map((o) => `- ${o.label}: ${o.valueText}`),
    '',
    '== Documentos recientes ==',
    ...longitudinal.documents.slice(0, 5).map((d) => `- ${d.title} (${d.documentType})`),
    '',
    '— Requiere revisión humana antes de uso clínico —',
  ];

  return {
    filename: `resumen-${patient.displayName.replace(/\s+/g, '-').toLowerCase()}.txt`,
    contentType: 'text/plain; charset=utf-8',
    body: lines.join('\n'),
    requiresHumanReview: true as const,
  };
}
