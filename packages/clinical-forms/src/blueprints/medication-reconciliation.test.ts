import { describe, expect, it } from 'vitest';
import { getBlueprintById } from '../registry.js';
import { medicationReconciliationBlueprint } from './medication-reconciliation.js';

describe('medicationReconciliationBlueprint', () => {
  it('registrado con intent reconcile_medications', () => {
    expect(getBlueprintById('medication_reconciliation')).toBe(medicationReconciliationBlueprint);
    expect(medicationReconciliationBlueprint.routePath).toBe('/espacio/conciliacion');
    expect(medicationReconciliationBlueprint.intentIds).toContain('reconcile_medications');
  });
});
