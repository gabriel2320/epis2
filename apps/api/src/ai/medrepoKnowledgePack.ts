import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const knowledgePackChunkSchema = z.object({
  chunkId: z.string().uuid(),
  fileId: z.string().uuid(),
  fileName: z.string(),
  documentId: z.string().uuid(),
  documentTitle: z.string(),
  headingPath: z.string().nullable().optional(),
  pageStart: z.number().int().nullable(),
  pageEnd: z.number().int().nullable(),
  text: z.string().max(4000),
  qualityScore: z.number().min(0).max(1).nullable().optional(),
});

const knowledgePackSummarySchema = z.object({
  documentId: z.string().uuid(),
  fileId: z.string().uuid(),
  fileName: z.string(),
  level: z.enum(['document', 'chapter', 'section']),
  headingPath: z.string().nullable(),
  pageStart: z.number().int().nullable().optional(),
  pageEnd: z.number().int().nullable().optional(),
  summaryText: z.string().max(4000),
});

export const medrepoKnowledgePackSchema = z.object({
  packId: z.string().min(1),
  title: z.string().min(1),
  version: z.string().default('0.1.0'),
  versionNumber: z.number().int().positive().optional(),
  exportedAt: z.string().datetime().optional(),
  sources: z.array(z.string()).default([]),
  topics: z.array(z.string()).default([]),
  facts: z.array(z.record(z.unknown())).default([]),
  chunks: z.array(knowledgePackChunkSchema).default([]),
  summaries: z.array(knowledgePackSummarySchema).default([]),
  safety: z.object({
    containsPatientData: z.boolean(),
    humanReviewed: z.boolean(),
  }),
});

export type MedrepoKnowledgePack = z.infer<typeof medrepoKnowledgePackSchema>;

export type MedrepoPackLoadState =
  | { status: 'loaded'; pack: MedrepoKnowledgePack; path: string }
  | { status: 'unavailable'; reason: string; path?: string };

const aiDir = dirname(fileURLToPath(import.meta.url));
const defaultDemoPackPath = join(aiDir, 'fixtures/medrepo-knowledge-pack-demo.json');

let cached: MedrepoPackLoadState | undefined;

function resolvePackPath(): string {
  const fromEnv = process.env.MEDREPO_KNOWLEDGE_PACK_PATH?.trim();
  if (fromEnv) return fromEnv;
  return defaultDemoPackPath;
}

function rejectUnsafePack(pack: MedrepoKnowledgePack): string | null {
  if (pack.safety.containsPatientData) {
    return 'Pack rechazado: containsPatientData=true';
  }
  if (!pack.safety.humanReviewed) {
    return 'Pack rechazado: humanReviewed=false';
  }
  return null;
}

/** Read-only loader — contrato MedRepo export, sin import @medrepo/*. */
export function loadMedrepoKnowledgePack(force = false): MedrepoPackLoadState {
  if (!force && cached !== undefined) return cached;

  const path = resolvePackPath();
  if (!existsSync(path)) {
    cached = { status: 'unavailable', reason: 'Archivo de knowledge pack no encontrado', path };
    return cached;
  }

  try {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
    const pack = medrepoKnowledgePackSchema.parse(raw);
    const rejectReason = rejectUnsafePack(pack);
    if (rejectReason) {
      cached = { status: 'unavailable', reason: rejectReason, path };
      return cached;
    }
    cached = { status: 'loaded', pack, path };
    return cached;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Parse error';
    cached = { status: 'unavailable', reason: `Pack inválido: ${message}`, path };
    return cached;
  }
}

export function resetMedrepoKnowledgePackCache(): void {
  cached = undefined;
}

export function getMedrepoPackStatus() {
  const state = loadMedrepoKnowledgePack();
  if (state.status === 'unavailable') {
    return {
      enabled: false as const,
      reason: state.reason,
      path: state.path,
      readOnly: true as const,
    };
  }

  const { pack } = state;
  return {
    enabled: true as const,
    readOnly: true as const,
    packId: pack.packId,
    title: pack.title,
    version: pack.version,
    chunkCount: pack.chunks.length,
    summaryCount: pack.summaries.length,
    topics: pack.topics,
    path: state.path,
  };
}

function tokenizeQuery(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[^a-z0-9]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length >= 4);
}

function scoreText(text: string, tokens: string[]): number {
  const haystack = text.toLowerCase();
  return tokens.reduce((score, token) => (haystack.includes(token) ? score + 1 : score), 0);
}

/** CDS silencioso — líneas breves para safetyNotes de assist (sin PHI). */
export function getMedrepoAssistSafetyNotes(
  blueprintId?: string,
  currentFields?: Record<string, string>,
): string[] {
  const state = loadMedrepoKnowledgePack();
  if (state.status !== 'loaded') return [];

  const fieldText = Object.values(currentFields ?? {}).join(' ');
  const query = [blueprintId ?? '', fieldText].filter(Boolean).join(' ');
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];

  const hits: Array<{ score: number; line: string }> = [];

  for (const chunk of state.pack.chunks) {
    const score = scoreText(`${chunk.documentTitle} ${chunk.text}`, tokens);
    if (score <= 0) continue;
    hits.push({
      score,
      line: `- [medrepo] ${chunk.documentTitle}: ${chunk.text.slice(0, 180)}`,
    });
  }

  for (const summary of state.pack.summaries) {
    const score = scoreText(summary.summaryText, tokens);
    if (score <= 0) continue;
    hits.push({
      score,
      line: `- [medrepo] ${summary.headingPath ?? summary.fileName}: ${summary.summaryText.slice(0, 160)}`,
    });
  }

  return hits
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((hit) => hit.line);
}
