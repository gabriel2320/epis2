import { describe, expect, it } from 'vitest';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import {
  assistBlueprintIntentBoost,
  isTraditionalSectionNavId,
  traditionalSectionIntentBoost,
} from './context-section-rank.js';

function defFor(intent: string) {
  const def = EPIS2_COMMAND_DEFINITIONS.find((d) => d.intent === intent);
  if (!def) throw new Error(`missing def ${intent}`);
  return def;
}

describe('context-section-rank MF-CM-04', () => {
  it('valida nav ids tradicionales', () => {
    expect(isTraditionalSectionNavId('navOrders')).toBe(true);
    expect(isTraditionalSectionNavId('navUnknown')).toBe(false);
  });

  it('navOrders impulsa laboratorio', () => {
    const boost = traditionalSectionIntentBoost(defFor('request_laboratory'), 'navOrders');
    expect(boost).toBeGreaterThan(0);
  });

  it('navMeds impulsa conciliación', () => {
    const boost = traditionalSectionIntentBoost(defFor('reconcile_medications'), 'navMeds');
    expect(boost).toBeGreaterThan(0);
  });

  it('navOrders no impulsa conciliación', () => {
    expect(traditionalSectionIntentBoost(defFor('reconcile_medications'), 'navOrders')).toBe(0);
  });

  it('blueprint evolution_note impulsa evolución', () => {
    const boost = assistBlueprintIntentBoost(defFor('create_evolution_draft'), 'evolution_note');
    expect(boost).toBeGreaterThan(0);
  });
});
