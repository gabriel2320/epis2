import { z } from 'zod';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import { finalizeRecord, SYNTHESIZE_PROMPT_VERSION } from './normalize.js';

export const synthesizeOutputSchema = z.object({
  scenario: z.string().min(1),
  recentEvents: z.string().min(1),
  pendingItems: z.string().min(1),
  clinicalAlertsNote: z.string().optional(),
  suggestedCapabilities: z.array(z.string().min(1)).min(1).optional(),
  risk: z.enum(['low', 'medium', 'high']).optional(),
});

export type SynthesizeOutput = z.infer<typeof synthesizeOutputSchema>;

function coerceText(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (Array.isArray(value)) {
    const parts = value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
    return parts.length > 0 ? parts.join('. ') : undefined;
  }
  return undefined;
}

function coerceCapabilities(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const parts = value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  return parts.length > 0 ? parts : undefined;
}

/** Normaliza salidas laxas de Ollama antes de validar con Zod. */
export function parseSynthesizeOutput(raw: unknown): SynthesizeOutput | null {
  if (!raw || typeof raw !== 'object') return null;
  const source = raw as Record<string, unknown>;
  const scenario = coerceText(source.scenario);
  const recentEvents = coerceText(source.recentEvents);
  const pendingItems = coerceText(source.pendingItems);
  if (!scenario || !recentEvents || !pendingItems) return null;

  const parsed = synthesizeOutputSchema.safeParse({
    scenario,
    recentEvents,
    pendingItems,
    ...(coerceText(source.clinicalAlertsNote)
      ? { clinicalAlertsNote: coerceText(source.clinicalAlertsNote) }
      : {}),
    ...(coerceCapabilities(source.suggestedCapabilities)
      ? { suggestedCapabilities: coerceCapabilities(source.suggestedCapabilities) }
      : {}),
    ...(typeof source.risk === 'string' ? { risk: source.risk } : {}),
  });
  return parsed.success ? parsed.data : null;
}

const ALLOWED_CAPABILITIES = new Set([
  'evolution_note',
  'discharge_summary',
  'prescription',
  'lab_request',
  'nursing_note',
  'pharmacy_validation',
  'medication_reconciliation',
  'procedure_request',
  'rbac',
  'draft_approval',
]);

function ensureSyntheticMarker(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('sintético') || lower.includes('sintetico') || lower.includes('demo')) {
    return text.trim();
  }
  return `${text.trim()} (sintético)`;
}

export function buildSynthesizePrompt(record: ClinicalCaseRecord): string {
  const clinical = record.clinical;
  return [
    'Eres un asistente clínico de EPIS2. Genera SOLO JSON válido en español (Chile).',
    'Reglas estrictas:',
    '- Paciente 100% ficticio; NO nombres reales, hospitales, fechas identificables ni RUT.',
    '- NO prescribas ni firmes; solo contexto narrativo de demo.',
    '- Marca explícitamente que es sintético/demo en scenario y recentEvents.',
    '- NO inventes problemas nuevos; usa solo los listados.',
    '- capabilities sugeridas solo del catálogo EPIS2.',
    '',
    'JSON requerido:',
    '{',
    '  "scenario": "narrativa clínica breve (2-3 oraciones)",',
    '  "recentEvents": "eventos últimas 24 h",',
    '  "pendingItems": "pendientes de seguimiento demo",',
    '  "clinicalAlertsNote": "nota opcional de alertas ficticias",',
    '  "suggestedCapabilities": ["evolution_note", "lab_request"],',
    '  "risk": "low|medium|high"',
    '}',
    '',
    `Caso base (${record.caseCode}):`,
    `Problemas: ${clinical.problems.join('; ')}`,
    `Observaciones: ${clinical.observations.map((o) => `${o.label}: ${o.valueText}`).join('; ') || 'ninguna'}`,
    `Medicación: ${clinical.medications?.map((m) => m.name).join('; ') || 'ninguna'}`,
    `Escenario actual: ${clinical.scenario}`,
    `Sexo: ${record.patient.sex}; edad aprox: ${record.patient.birthDate}`,
  ].join('\n');
}

/** Fusiona salida IA sobre el registro scrapeado (pura, testeable). */
export function applySynthesizeOutput(
  record: ClinicalCaseRecord,
  output: SynthesizeOutput,
  model: string,
): ClinicalCaseRecord {
  const scenario = ensureSyntheticMarker(output.scenario);
  const recentEvents = ensureSyntheticMarker(output.recentEvents);
  const pendingItems = ensureSyntheticMarker(output.pendingItems);
  const alertsBase = record.epis2Mapping.summaryFields.clinicalAlerts ?? 'SIM / SINTÉTICO';
  const clinicalAlerts = output.clinicalAlertsNote
    ? `${alertsBase} — ${ensureSyntheticMarker(output.clinicalAlertsNote)}`
    : alertsBase;

  const capabilities = output.suggestedCapabilities?.filter((c) => ALLOWED_CAPABILITIES.has(c)) ??
    record.evolabHints?.capabilities ?? ['evolution_note'];

  const risk = output.risk ?? record.evolabHints?.risk ?? 'low';

  return finalizeRecord(
    {
      ...record,
      provenance: {
        ...record.provenance,
        sourceType: 'hybrid',
      },
      clinical: {
        ...record.clinical,
        scenario,
      },
      epis2Mapping: {
        ...record.epis2Mapping,
        summaryFields: {
          ...record.epis2Mapping.summaryFields,
          recentEvents,
          pendingItems,
          clinicalAlerts,
        },
      },
      evolabHints: {
        capabilities,
        suggestedGoals: record.evolabHints?.suggestedGoals ?? [
          'create_evolution_note',
          'review_clinical_context',
        ],
        risk,
      },
    },
    { promptVersion: SYNTHESIZE_PROMPT_VERSION, model },
  );
}

export type SynthesizeResult =
  | { ok: true; record: ClinicalCaseRecord; model: string }
  | { ok: false; record: ClinicalCaseRecord; reason: string };

export type SynthesizeJsonClient = {
  generate(
    prompt: string,
  ): Promise<{ ok: true; json: unknown; model: string } | { ok: false; reason: string }>;
};

export async function synthesizeRecord(
  record: ClinicalCaseRecord,
  client: SynthesizeJsonClient,
): Promise<SynthesizeResult> {
  const prompt = buildSynthesizePrompt(record);
  const result = await client.generate(prompt);
  if (!result.ok) {
    return { ok: false, record, reason: result.reason };
  }

  const parsed = parseSynthesizeOutput(result.json);
  if (!parsed) {
    return {
      ok: false,
      record,
      reason: 'JSON IA inválido o incompleto tras normalización',
    };
  }

  return {
    ok: true,
    record: applySynthesizeOutput(record, parsed, result.model),
    model: result.model,
  };
}
