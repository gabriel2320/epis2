import type { Database } from '../db/client.js';
import { getPatientLongitudinal } from '../clinical/longitudinal.js';
import { fetchLocalAiStatus, pingOllama } from './client.js';
import { recordAiRun } from './store.js';
import type { AppConfig } from '../config.js';

const HOURS_24_MS = 24 * 60 * 60 * 1000;

export async function suggestPatientSummary24h(
  db: Database,
  config: AppConfig,
  actorId: string,
  patientId: string,
) {
  const longitudinal = await getPatientLongitudinal(db, patientId);
  const since = Date.now() - HOURS_24_MS;
  const recent = longitudinal.timeline.filter((e) => new Date(e.at).getTime() >= since);

  const activeProblems = longitudinal.problems
    .filter((p) => p.status === 'active')
    .map((p) => p.description)
    .join('; ');
  const meds = longitudinal.medications.map((m) => m.name).join('; ');
  const allergies = longitudinal.allergies.map((a) => a.substance).join('; ');

  const lines = [
    `Resumen sintético 24 h (demo, requiere revisión humana):`,
    `Problemas activos: ${activeProblems || '—'}`,
    `Medicamentos: ${meds || '—'}`,
    `Alergias: ${allergies || '—'}`,
    recent.length > 0
      ? `Eventos recientes (${recent.length}): ${recent.map((e) => e.title).join(' · ')}`
      : 'Sin eventos en las últimas 24 h en timeline demo.',
  ];

  const localAiUp = await fetchLocalAiStatus(config.LOCAL_AI_BASE_URL);
  const ollamaUp = localAiUp && (await pingOllama(config.OLLAMA_BASE_URL));
  const source = ollamaUp ? ('ollama_synthesis' as const) : ('longitudinal_retrieval' as const);

  if (ollamaUp) {
    lines.push('(Ollama disponible — texto base generado desde SoT; no sustituye juicio clínico.)');
  }

  const summaryText = lines.join('\n');

  const row = await recordAiRun(db, {
    actorId,
    blueprintId: 'patient_summary_24h',
    patientId,
    promptHash: 'summary:24h:v5-demo',
    model: ollamaUp ? 'ollama-demo' : 'retrieval-only',
    latencyMs: 0,
    status: 'success',
    inputPayload: { patientId },
    outputPayload: { summaryText, eventCount: recent.length, source },
  });

  return {
    readOnly: true as const,
    requiresHumanReview: true as const,
    summaryText,
    source,
    eventCount: recent.length,
    runId: row?.id,
    aiAvailable: ollamaUp,
  };
}
