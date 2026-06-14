import { pickChipSampleEs } from './chip-samples.js';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { isClinicalRole } from './roleSuggestions.js';
import type { CommandChip } from './chips.js';
import type { ClinicalIntent, CommandActiveContext } from './types.js';
import { roleHasPermission, type ClinicalRole } from '@epis2/clinical-domain';

export type PatientCareSetting = 'ambulatory' | 'hospitalized' | 'urgency';

const CARE_SETTING_INTENTS: Record<PatientCareSetting, readonly ClinicalIntent[]> = {
  ambulatory: [
    'create_evolution_draft',
    'prepare_prescription',
    'request_laboratory',
    'create_medical_certificate',
    'request_referral',
  ],
  hospitalized: [
    'create_evolution_draft',
    'request_procedure',
    'open_results_inbox',
    'request_imaging',
    'prepare_discharge_draft',
  ],
  urgency: [
    'create_evolution_draft',
    'create_nursing_note',
    'request_laboratory',
    'register_problem',
    'request_referral',
  ],
};

const CHRONIC_SAMPLE_OVERRIDES: Partial<
  Record<ClinicalIntent, Partial<Record<'dm2' | 'hta', string>>>
> = {
  create_evolution_draft: {
    dm2: 'control diabetes',
    hta: 'control hta',
  },
  prepare_prescription: {
    dm2: 'renovar receta cronica',
    hta: 'renovar receta cronica',
  },
  request_laboratory: {
    dm2: 'solicitar panel control dm2',
    hta: 'solicitar laboratorio control hta',
  },
};

function fold(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/** MF-DI-05 — inferir escenario de atención desde read model / demo. */
export function inferPatientCareSetting(input: {
  hospitalizado?: boolean | undefined;
  scenarioLabel?: string | null | undefined;
}): PatientCareSetting {
  if (input.hospitalizado) return 'hospitalized';
  const scenario = fold(input.scenarioLabel ?? '');
  if (/urgencia|emergencia|guardia|triaje|shock|reanimacion/.test(scenario)) {
    return 'urgency';
  }
  return 'ambulatory';
}

function intentBoosts(
  context: CommandActiveContext | undefined,
  chronicFocus: 'dm2' | 'hta' | null | undefined,
): Partial<Record<ClinicalIntent, number>> {
  const boosts: Partial<Record<ClinicalIntent, number>> = {};
  const drafts = context?.pendingDraftCount ?? 0;
  const alerts = context?.activeAlertCount ?? 0;

  if (drafts > 0) boosts.create_evolution_draft = 20 + drafts;
  if (alerts > 0) boosts.open_results_inbox = 18 + alerts;

  if (chronicFocus === 'dm2') {
    boosts.create_evolution_draft = Math.max(boosts.create_evolution_draft ?? 0, 12);
    boosts.request_laboratory = Math.max(boosts.request_laboratory ?? 0, 10);
    boosts.prepare_prescription = Math.max(boosts.prepare_prescription ?? 0, 8);
  } else if (chronicFocus === 'hta') {
    boosts.create_evolution_draft = Math.max(boosts.create_evolution_draft ?? 0, 10);
    boosts.prepare_prescription = Math.max(boosts.prepare_prescription ?? 0, 8);
  }

  return boosts;
}

function isProbableActionAllowed(
  intent: ClinicalIntent,
  role: string,
  permissions: readonly string[],
): boolean {
  const def = EPIS2_COMMAND_DEFINITIONS.find((d) => d.intent === intent);
  if (!def) return false;
  if (!permissions.includes(def.requiredPermission)) return false;
  if (!isClinicalRole(role)) return false;
  return roleHasPermission(role as ClinicalRole, def.requiredPermission);
}

function orderIntents(
  base: readonly ClinicalIntent[],
  boosts: Partial<Record<ClinicalIntent, number>>,
): ClinicalIntent[] {
  return [...base].sort((a, b) => (boosts[b] ?? 0) - (boosts[a] ?? 0));
}

export type ProbablePatientActionInput = {
  role: string;
  permissions: readonly string[];
  careSetting: PatientCareSetting;
  context?: CommandActiveContext | undefined;
  chronicFocus?: 'dm2' | 'hta' | null | undefined;
  maxActions?: number | undefined;
};

/** MF-DI-05 — acciones probables ranked para ficha paciente (determinístico). */
export function getProbablePatientActionChips(input: ProbablePatientActionInput): CommandChip[] {
  const max = input.maxActions ?? 5;
  const boosts = intentBoosts(input.context, input.chronicFocus);
  const ordered = orderIntents(CARE_SETTING_INTENTS[input.careSetting], boosts);

  const chips: CommandChip[] = [];
  for (const intent of ordered) {
    if (!isProbableActionAllowed(intent, input.role, input.permissions)) continue;
    const def = EPIS2_COMMAND_DEFINITIONS.find((d) => d.intent === intent);
    if (!def) continue;

    const chronicOverride =
      input.chronicFocus && CHRONIC_SAMPLE_OVERRIDES[intent]?.[input.chronicFocus];
    const sampleEs = chronicOverride ?? pickChipSampleEs(def.aliasesEs, def.labelEs);

    chips.push({
      id: `probable-${intent}`,
      labelEs: def.labelEs,
      sampleEs,
      intent: def.intent,
    });
    if (chips.length >= max) break;
  }

  return chips;
}
