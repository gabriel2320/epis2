import { createHash } from 'node:crypto';
import { clinicalCaseRecordSchema, type ClinicalCaseRecord } from '@epis2/contracts';

export const PROMPT_VERSION = 'mf-case-06-catalog-v1';
export const SYNTHESIZE_PROMPT_VERSION = 'mf-case-02-ollama-v1';

/** Hash estable del contenido clínico (sin timestamps) para idempotencia en staging. */
export function recordContentHash(record: ClinicalCaseRecord): string {
  const content: Partial<ClinicalCaseRecord> = { ...record };
  delete content.fetchedAt;
  delete content.generation;
  const stable = JSON.stringify(content, Object.keys(content).sort());
  return createHash('sha256').update(stable).digest('hex');
}

export function buildCaseCode(primaryProblemSlug: string, externalPatientId: string): string {
  const suffix = createHash('sha256').update(externalPatientId).digest('hex').slice(0, 4);
  const slug = primaryProblemSlug
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 12);
  return `SIM-${slug || 'CASO'}-${suffix}`;
}

export function fictionalDisplayName(sex: 'F' | 'M', seed: string): string {
  const namesF = ['Camila R.', 'Valentina M.', 'Sofía L.', 'María P.', 'Daniela V.'];
  const namesM = ['Matías R.', 'Sebastián M.', 'Diego L.', 'Andrés P.', 'Nicolás V.'];
  const pool = sex === 'F' ? namesF : namesM;
  const index =
    Number.parseInt(createHash('sha256').update(seed).digest('hex').slice(0, 8), 16) % pool.length;
  return `Paciente Sim — ${pool[index]}`;
}

export function buildSummaryFields(
  clinical: ClinicalCaseRecord['clinical'],
): Record<string, string> {
  return {
    activeProblems: clinical.problems.join('\n'),
    recentEvents: `Últimas 24 h: evolución estable (sintético)`,
    relevantLabs:
      clinical.observations.length > 0
        ? clinical.observations.map((o) => `${o.label} ${o.valueText}`).join(' · ')
        : 'Sin laboratorio reciente (sintético)',
    activeMedications:
      clinical.medications?.map((m) => `${m.name}${m.doseText ? ` ${m.doseText}` : ''}`).join(' · ') ??
      'Sin medicación activa registrada (sintético)',
    pendingItems: 'Seguimiento ambulatorio en 7 días (demo)',
    clinicalAlerts: 'SIM / SINTÉTICO — sin alertas reales',
  };
}

export function finalizeRecord(
  draft: Omit<ClinicalCaseRecord, 'generation' | 'fetchedAt'> & { fetchedAt?: string },
  options?: { promptVersion?: string; model?: string },
): ClinicalCaseRecord {
  const fetchedAt = draft.fetchedAt ?? new Date().toISOString();
  const record: ClinicalCaseRecord = {
    ...draft,
    fetchedAt,
    generation: {
      promptVersion: options?.promptVersion ?? PROMPT_VERSION,
      requiresHumanReview: true,
      contentHash: '',
      ...(options?.model ? { model: options.model } : {}),
    },
  };
  record.generation.contentHash = recordContentHash(record);
  return clinicalCaseRecordSchema.parse(record);
}
