import { CHART_SECTION_MIRROR_BINDINGS } from '../chart-section-mirror.js';
import { PAPER_MIRROR_VARIABLE_KEYS } from '../paper-mirror/variable-keys.js';
import {
  applyPaperChartSectionPatch,
  emptyPaperChartDraft,
  type PaperChartDraftBody,
  type PaperChartSectionId,
} from './schema.js';

/** Variables espejo clásico→papel (PROG-PAPER-MIRROR / MF-PA-05). */
export type PaperMirrorVariables = Record<string, string>;

export function buildMirrorVariablesFromSummaryFields(
  summaryFields: Record<string, string>,
): PaperMirrorVariables {
  const variables: PaperMirrorVariables = {};
  for (const entry of PAPER_MIRROR_VARIABLE_KEYS) {
    const value = summaryFields[entry.classicFieldId]?.trim();
    if (value) variables[entry.variableKey] = value;
  }
  return variables;
}

function formatMirrorSlotText(slot: string, text: string): string {
  return `[${slot}] ${text}`;
}

function mergeMirrorSectionText(existing: string, incoming: string, slot: string): string {
  const line = formatMirrorSlotText(slot, incoming);
  if (!existing.trim()) return line;
  if (existing.includes(incoming)) return existing;
  return `${existing}\n${line}`;
}

/** Rellena secciones papel vacías desde variables espejo — no sobrescribe contenido humano. */
export function seedPaperDraftFromMirrorVariables(
  draft: PaperChartDraftBody,
  variables: PaperMirrorVariables,
): PaperChartDraftBody {
  let next = draft;
  for (const entry of PAPER_MIRROR_VARIABLE_KEYS) {
    const text = variables[entry.variableKey]?.trim();
    if (!text) continue;
    const current = next[entry.paperSectionId];
    if (current.value.trim()) continue;
    next = applyPaperChartSectionPatch(next, {
      sectionId: entry.paperSectionId,
      body: mergeMirrorSectionText(current.value, text, entry.paperSlot),
      source: 'system',
      confirmed: true,
    });
  }
  return next;
}

/** Mapeo coarse fieldId nav ↔ sección papel (NORM-01). */
export function resolvePaperSectionForChartFieldId(fieldId: string): PaperChartSectionId | null {
  const binding = CHART_SECTION_MIRROR_BINDINGS.find((b) => b.fieldId === fieldId);
  return binding?.paperSectionId ?? null;
}

export function isPaperDraftEmpty(draft: PaperChartDraftBody): boolean {
  return Object.values(draft).every((field) => !field.value.trim());
}

/** Seed demo/SoT: summaryFields → paper_chart borrador vacío. */
export function reconcilePaperDraftFromSummaryFields(
  summaryFields: Record<string, string>,
  draft: PaperChartDraftBody = emptyPaperChartDraft(),
): PaperChartDraftBody {
  if (!isPaperDraftEmpty(draft)) return draft;
  const variables = buildMirrorVariablesFromSummaryFields(summaryFields);
  return seedPaperDraftFromMirrorVariables(draft, variables);
}

export function assertPaperMirrorReconcileInvariants(): string[] {
  const errors: string[] = [];
  const keys = new Set<string>();
  for (const entry of PAPER_MIRROR_VARIABLE_KEYS) {
    if (keys.has(entry.variableKey)) {
      errors.push(`mirror variable duplicada: ${entry.variableKey}`);
    }
    keys.add(entry.variableKey);
    if (!entry.paperSectionId || !entry.paperSlot) {
      errors.push(`mirror entry incompleta: ${entry.variableKey}`);
    }
  }
  return errors;
}
