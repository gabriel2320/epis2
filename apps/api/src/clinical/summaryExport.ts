import type { Database } from '../db/client.js';
import { getPatientLongitudinal } from './longitudinal.js';
import { getPatientById } from './service.js';
import { buildMinimalPdf } from './minimalPdf.js';

/** Slug ASCII seguro para cabeceras HTTP (evita ERR_INVALID_CHAR en nombres con tildes). */
export function safePatientExportSlug(displayName: string): string {
  return (
    displayName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 'paciente'
  );
}

async function buildSummaryLines(db: Database, patientId: string) {
  const patient = await getPatientById(db, patientId);
  if (!patient) return null;

  const longitudinal = await getPatientLongitudinal(db, patientId);
  const lines: string[] = [
    'EPIS2 — Resumen clinico (demo, no firmado)',
    `Paciente: ${patient.displayName}`,
    `ID: ${patientId}`,
    `Generado: ${new Date().toISOString()}`,
    '',
    '== Problemas activos ==',
    ...longitudinal.problems.filter((p) => p.status === 'active').map((p) => `- ${p.description}`),
    '',
    '== Alergias ==',
    ...longitudinal.allergies.map((a) => `- ${a.substance} (${a.severity})`),
    '',
    '== Medicacion activa ==',
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
    '— Requiere revision humana antes de uso clinico —',
  ];

  return { patient, lines };
}

export async function buildPatientSummaryExport(
  db: Database,
  patientId: string,
  format: 'txt' | 'pdf' = 'txt',
) {
  const built = await buildSummaryLines(db, patientId);
  if (!built) return null;

  const slug = safePatientExportSlug(built.patient.displayName);
  if (format === 'pdf') {
    return {
      filename: `resumen-${slug}.pdf`,
      contentType: 'application/pdf',
      body: buildMinimalPdf(built.lines),
      requiresHumanReview: true as const,
    };
  }

  return {
    filename: `resumen-${slug}.txt`,
    contentType: 'text/plain; charset=utf-8',
    body: built.lines.join('\n'),
    requiresHumanReview: true as const,
  };
}
