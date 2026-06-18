import { describe, expect, it } from 'vitest';
import { assertRegistryInvariants, EPIS2_FORM_BLUEPRINTS } from '@epis2/clinical-forms';
import {
  assertClinicalActionManifestInvariants,
  CLINICAL_ACTION_MANIFEST,
  getClinicalActionByIntent,
  GOLDEN_CICA_INTENTS,
  INTENT_CICA_SCREEN_IDS,
} from './clinical-action-manifest.js';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { PAPER_CHART_INTENTS } from './paper-commands.js';
import { PAPER_PLANNER_INTENTS } from './paper-planner-commands.js';

const PAPER_NAV_INTENTS = new Set<string>([...PAPER_CHART_INTENTS, ...PAPER_PLANNER_INTENTS]);

describe('clinical-action-manifest MF-LX-01', () => {
  it('deriva una entrada por intent del command-registry', () => {
    expect(CLINICAL_ACTION_MANIFEST.length).toBe(EPIS2_COMMAND_DEFINITIONS.length);
    expect(assertClinicalActionManifestInvariants()).toEqual([]);
  });

  it('expone sinónimos desde aliasesEs', () => {
    const evolution = getClinicalActionByIntent('create_evolution_draft');
    expect(evolution?.synonyms).toContain('evolucionar');
    expect(evolution?.cicaScreenId).toBe('new-evolution');
    expect(evolution?.blueprintId).toBe('evolution_note');
    expect(evolution?.aiRequired).toBe(false);
  });

  it('mapea flujo dorado CICA', () => {
    for (const intent of GOLDEN_CICA_INTENTS) {
      expect(INTENT_CICA_SCREEN_IDS[intent]).toBeTruthy();
    }
  });

  it('intents open_form enlazan blueprint por intentId en clinical-forms', () => {
    const missing: string[] = [];
    for (const entry of CLINICAL_ACTION_MANIFEST) {
      if (entry.actionType !== 'open_form') continue;
      if (PAPER_NAV_INTENTS.has(entry.id)) continue;
      const linked = EPIS2_FORM_BLUEPRINTS.some((bp) => bp.intentIds.includes(entry.id));
      if (!linked) {
        missing.push(entry.id);
      }
    }
    expect(missing).toEqual([]);
  });

  it('no introduce reglas rotas en clinical-forms registry', () => {
    expect(assertRegistryInvariants()).toEqual([]);
  });

  it('dashboard intents sin pantalla CICA', () => {
    expect(getClinicalActionByIntent('open_dashboard')?.cicaScreenId).toBeUndefined();
    expect(getClinicalActionByIntent('open_dashboard_work')?.cicaScreenId).toBeUndefined();
  });
});
