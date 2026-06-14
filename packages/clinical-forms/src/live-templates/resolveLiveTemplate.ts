import { detectClinicalComorbiditySignals } from '@epis2/clinical-domain';
import type { ClinicalFormBlueprint } from '../types.js';
import {
  DM2_CONTROL_LIVE_TEMPLATE,
  evaluateLiveTemplateCondition,
  getLiveTemplateById,
  isLiveTemplateFieldVisible,
  type LiveTemplateDefinition,
} from './definitions.js';

export function canSuggestLiveTemplate(
  templateId: string,
  summaryFields: Record<string, string>,
): boolean {
  const template = getLiveTemplateById(templateId);
  if (!template) return false;
  const signals = detectClinicalComorbiditySignals(summaryFields);
  return template.suggestWhen.every((condition) => evaluateLiveTemplateCondition(condition, signals));
}

function filterTemplateSections(
  template: LiveTemplateDefinition,
  signals: ReturnType<typeof detectClinicalComorbiditySignals>,
) {
  const visibleFieldIds = new Set(
    template.extraFields.filter((f) => isLiveTemplateFieldVisible(f, signals)).map((f) => f.id),
  );
  return template.extraSections
    .map((sec) => ({
      ...sec,
      fieldIds: sec.fieldIds.filter((id) => visibleFieldIds.has(id)),
    }))
    .filter((sec) => sec.fieldIds.length > 0);
}

/**
 * MF-DI-07 — materializa blueprint base + campos condicionales visibles según comorbilidad.
 */
export function materializeLiveTemplateBlueprint(
  templateId: string,
  baseBlueprint: ClinicalFormBlueprint,
  summaryFields: Record<string, string>,
): ClinicalFormBlueprint | null {
  const template = getLiveTemplateById(templateId);
  if (!template || template.blueprintId !== baseBlueprint.blueprintId) return null;

  const signals = detectClinicalComorbiditySignals(summaryFields);
  const visibleFields = template.extraFields.filter((f) => isLiveTemplateFieldVisible(f, signals));
  if (visibleFields.length === 0 && template.suggestWhen.every((c) => !evaluateLiveTemplateCondition(c, signals))) {
    return null;
  }

  const extraSections = filterTemplateSections(template, signals);
  return {
    ...baseBlueprint,
    purpose: `${baseBlueprint.purpose} · ${template.label}`,
    sections: [...baseBlueprint.sections, ...extraSections],
    fields: [...baseBlueprint.fields, ...visibleFields],
  };
}

/** Prefill determinístico para campos condicionales de plantilla viva. */
export function buildLiveTemplatePrefill(
  templateId: string,
  summaryFields: Record<string, string>,
): Record<string, string> {
  if (templateId !== DM2_CONTROL_LIVE_TEMPLATE.templateId) return {};

  const signals = detectClinicalComorbiditySignals(summaryFields);
  const prefill: Record<string, string> = {};

  if (signals.hasCkd) {
    const labs = summaryFields.relevantLabs?.trim();
    prefill.renalFunctionReview = labs
      ? `Revisar función renal con laboratorio reciente: ${labs}. Ajustar metformina/SGLT2 según filtrado.`
      : 'Revisar creatinina y filtrado glomerular. Documentar estadio ERC y ajuste posológico.';
  }

  if (signals.onInsulin) {
    prefill.hypoglycemiaReview =
      'Indagar episodios hipoglucémicos desde último control. Revisar dosis basal/bolus y educación sobre manejo.';
  }

  return prefill;
}

export {
  DM2_CONTROL_LIVE_TEMPLATE,
  EPIS2_LIVE_TEMPLATES,
  evaluateLiveTemplateCondition,
  getLiveTemplateById,
  isLiveTemplateFieldVisible,
  type LiveTemplateDefinition,
} from './definitions.js';
