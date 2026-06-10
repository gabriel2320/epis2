import { z } from 'zod';
import {
  drugIntelRecordSchema,
  type DrugIntelDiscrepancy,
  type DrugIntelRecord,
} from '@epis2/contracts';
import { generateOllamaJson, pingOllama } from './ollama.js';

/**
 * Correlación Chile ↔ internacional.
 *
 * Capa determinística: chequeos estructurales que siempre corren.
 * Capa IA (opcional): Ollama resume discrepancias en lenguaje clínico; solo
 * puede AGREGAR discrepancias o resumen, nunca quitar flags ni aprobar
 * (invariante 11). Sin Ollama el resultado es igual de válido.
 */

export function deterministicDiscrepancies(record: DrugIntelRecord): DrugIntelDiscrepancy[] {
  const discrepancies: DrugIntelDiscrepancy[] = [];

  if (!record.activeIngredient) {
    discrepancies.push({
      field: 'activeIngredient',
      severity: 'warning',
      message: 'Sin principio activo identificado; no es posible correlación internacional.',
      sources: ['isp'],
    });
  }

  if (!record.atcCode && record.activeIngredient) {
    discrepancies.push({
      field: 'atcCode',
      severity: 'info',
      message: 'RxNorm/ATC no devolvió clasificación para el principio activo.',
      sources: ['rxnorm'],
    });
  }

  if (record.recommendedDoses.length === 0) {
    discrepancies.push({
      field: 'recommendedDoses',
      severity: 'warning',
      message: 'Sin dosis recomendadas en ninguna fuente; completar manualmente antes de promover.',
      sources: ['isp', 'openfda'],
    });
  }

  if (record.warnings.length === 0 && record.adverseReactions.length === 0) {
    discrepancies.push({
      field: 'warnings',
      severity: 'warning',
      message: 'Sin warnings ni reacciones adversas de etiqueta internacional.',
      sources: ['openfda'],
    });
  }

  if (record.ispAlerts.length > 0) {
    discrepancies.push({
      field: 'ispAlerts',
      severity: 'critical',
      message: `Producto con ${record.ispAlerts.length} alerta(s) de seguridad ISP vigente(s).`,
      sources: ['isp'],
    });
  }

  if (record.prices.length === 0) {
    discrepancies.push({
      field: 'prices',
      severity: 'info',
      message: 'Sin precio referencial chileno disponible.',
      sources: ['tufarmacia', 'cenabast'],
    });
  }

  const boxed = record.warnings.some((w) => w.source === 'openfda:boxed_warning');
  if (boxed) {
    discrepancies.push({
      field: 'warnings',
      severity: 'critical',
      message: 'La etiqueta FDA incluye boxed warning; revisar aplicabilidad local.',
      sources: ['openfda'],
    });
  }

  return discrepancies;
}

const aiCorrelationOutputSchema = z.object({
  summary: z.string().min(1).max(2000),
  additionalDiscrepancies: z
    .array(
      z.object({
        field: z.string().min(1),
        severity: z.enum(['info', 'warning', 'critical']),
        message: z.string().min(1),
      }),
    )
    .max(10)
    .default([]),
});

function buildAiPrompt(record: DrugIntelRecord): string {
  const context = {
    productName: record.productName,
    activeIngredient: record.activeIngredient ?? null,
    atcCode: record.atcCode ?? null,
    pharmaceuticalForms: record.pharmaceuticalForms,
    recommendedDoses: record.recommendedDoses.map((d) => ({
      population: d.population,
      text: d.text.slice(0, 400),
    })),
    warnings: record.warnings.map((w) => ({ source: w.source, text: w.text.slice(0, 400) })),
    adverseReactions: record.adverseReactions.map((r) => ({
      source: r.source,
      text: r.text.slice(0, 400),
    })),
    ispAlerts: record.ispAlerts.map((a) => a.title),
  };
  return [
    'Eres un asistente de farmacovigilancia. Compara la información chilena (ISP) con la etiqueta internacional (OpenFDA/RxNorm) de este fármaco.',
    'Responde SOLO JSON con la forma: {"summary": string, "additionalDiscrepancies": [{"field": string, "severity": "info"|"warning"|"critical", "message": string}]}.',
    'El summary (máx. 3 frases, español) describe consistencia entre fuentes. Solo agrega discrepancias con evidencia en los datos entregados; no inventes.',
    'NO apruebas ni rechazas el registro: la decisión es humana.',
    `Datos: ${JSON.stringify(context)}`,
  ].join('\n');
}

export interface CorrelateOptions {
  ollamaBaseUrl?: string;
  ollamaModel?: string;
}

export async function correlateRecord(
  record: DrugIntelRecord,
  options: CorrelateOptions = {},
): Promise<DrugIntelRecord> {
  const discrepancies = deterministicDiscrepancies(record);
  const correlatedAt = new Date().toISOString();

  let aiModel: string | undefined;
  let aiSummary: string | undefined;

  const baseUrl = options.ollamaBaseUrl;
  if (baseUrl && (await pingOllama(baseUrl))) {
    const model = options.ollamaModel ?? 'qwen3:8b';
    const result = await generateOllamaJson(baseUrl, buildAiPrompt(record), model);
    if (result.ok) {
      const parsed = aiCorrelationOutputSchema.safeParse(result.json);
      if (parsed.success) {
        aiModel = result.model;
        aiSummary = parsed.data.summary;
        for (const extra of parsed.data.additionalDiscrepancies) {
          discrepancies.push({ ...extra, sources: ['ai:ollama'] });
        }
      }
    }
  }

  const correlated: DrugIntelRecord = {
    ...record,
    correlation: {
      status: discrepancies.length === 0 ? 'consistent' : 'discrepant',
      // La IA nunca baja este flag: cualquier discrepancia (incluida una
      // agregada por IA) exige revisión humana antes de promover.
      requiresHumanReview: discrepancies.length > 0,
      discrepancies,
      correlatedAt,
      ...(aiModel ? { aiModel } : {}),
      ...(aiSummary ? { aiSummary } : {}),
    },
  };
  return drugIntelRecordSchema.parse(correlated);
}
