import type { ClinicalComorbiditySignals } from '@epis2/clinical-domain';
import { field, section } from '../factory.js';
import type { ClinicalFormBlueprint, FormField, LiveTemplateCondition } from '../types.js';

export type LiveTemplateDefinition = {
  templateId: string;
  blueprintId: string;
  label: string;
  /** Todas las condiciones deben cumplirse para sugerir la plantilla. */
  suggestWhen: readonly LiveTemplateCondition[];
  extraSections: ClinicalFormBlueprint['sections'];
  extraFields: readonly FormField[];
};

export const CKD_RENAL_LIVE_TEMPLATE: LiveTemplateDefinition = {
  templateId: 'ckd_renal_review',
  blueprintId: 'evolution_note',
  label: 'Seguimiento función renal',
  suggestWhen: ['requires_ckd'],
  extraSections: [section('ckd_review', 'Seguimiento renal', ['ckdFunctionReview'], 'visible')],
  extraFields: [
    field('ckdFunctionReview', 'Función renal (ERC)', 'textarea', {
      clinicalTextBox: true,
      variableKey: 'evolution.ckd.renal_review',
    }),
  ],
};

export const INSULIN_HYPO_LIVE_TEMPLATE: LiveTemplateDefinition = {
  templateId: 'insulin_hypo_review',
  blueprintId: 'evolution_note',
  label: 'Control insulina e hipoglucemias',
  suggestWhen: ['requires_insulin'],
  extraSections: [
    section('insulin_review', 'Insulina e hipoglucemias', ['insulinHypoReview'], 'visible'),
  ],
  extraFields: [
    field('insulinHypoReview', 'Revisión hipoglucemias', 'textarea', {
      clinicalTextBox: true,
      variableKey: 'evolution.insulin.hypo_review',
    }),
  ],
};

export const DM2_CONTROL_LIVE_TEMPLATE: LiveTemplateDefinition = {
  templateId: 'dm2_control',
  blueprintId: 'evolution_note',
  label: 'Control diabetes mellitus tipo 2',
  suggestWhen: ['requires_dm2'],
  extraSections: [
    section(
      'dm2_comorbidities',
      'Comorbilidades control DM2',
      ['renalFunctionReview', 'hypoglycemiaReview'],
      'collapsed',
    ),
  ],
  extraFields: [
    field('renalFunctionReview', 'Función renal (ERC)', 'textarea', {
      clinicalTextBox: true,
      liveWhen: ['requires_ckd'],
      variableKey: 'evolution.dm2.renal_review',
    }),
    field('hypoglycemiaReview', 'Revisión hipoglucemias (insulina)', 'textarea', {
      clinicalTextBox: true,
      liveWhen: ['requires_insulin'],
      variableKey: 'evolution.dm2.hypoglycemia_review',
    }),
  ],
};

export const EPIS2_LIVE_TEMPLATES: readonly LiveTemplateDefinition[] = [
  DM2_CONTROL_LIVE_TEMPLATE,
  CKD_RENAL_LIVE_TEMPLATE,
  INSULIN_HYPO_LIVE_TEMPLATE,
];

const byId = new Map(EPIS2_LIVE_TEMPLATES.map((t) => [t.templateId, t]));

export function getLiveTemplateById(templateId: string): LiveTemplateDefinition | undefined {
  return byId.get(templateId);
}

export function evaluateLiveTemplateCondition(
  condition: LiveTemplateCondition,
  signals: ClinicalComorbiditySignals,
): boolean {
  switch (condition) {
    case 'requires_dm2':
      return signals.hasDm2;
    case 'requires_ckd':
      return signals.hasCkd;
    case 'requires_insulin':
      return signals.onInsulin;
    default:
      return false;
  }
}

export function isLiveTemplateFieldVisible(
  fieldDef: FormField,
  signals: ClinicalComorbiditySignals,
): boolean {
  if (!fieldDef.liveWhen?.length) return true;
  return fieldDef.liveWhen.every((condition) => evaluateLiveTemplateCondition(condition, signals));
}
