import { describe, expect, it, vi } from 'vitest';
import type { CicaScreenBlueprint } from '@epis2/epis2-ui';
import { buildCicaBlueprintActions } from './buildCicaBlueprintActions.js';

describe('buildCicaBlueprintActions', () => {
  it('resolves CICA navigation from blueprint actions', () => {
    const blueprint: CicaScreenBlueprint = {
      screenId: 'patient-summary',
      sections: [{ id: 'summary', span: 12 }],
      actions: [
        {
          id: 'new-evolution',
          label: 'Nueva evolución',
          kind: 'primary',
          targetScreenId: 'new-evolution',
        },
      ],
    };
    const go = vi.fn();
    const actions = buildCicaBlueprintActions(blueprint, {
      patientId: 'patient-1',
      go,
    });

    expect(actions).toHaveLength(1);
    actions[0]?.onClick();
    expect(go).toHaveBeenCalledWith('new-evolution', { patientId: 'patient-1' });
  });

  it('resolves legacy path navigation when goLegacy is provided', () => {
    const blueprint: CicaScreenBlueprint = {
      screenId: 'patient-audit',
      sections: [{ id: 'audit', span: 12 }],
      actions: [
        {
          id: 'audit-console',
          label: 'Consola auditoría',
          kind: 'primary',
          legacyPath: '/espacio/admin',
          legacySearch: { tab: 'audit' },
        },
      ],
    };
    const goLegacy = vi.fn();
    const actions = buildCicaBlueprintActions(blueprint, {
      patientId: 'patient-1',
      go: vi.fn(),
      goLegacy,
    });

    actions[0]?.onClick();
    expect(goLegacy).toHaveBeenCalledWith('/espacio/admin', { tab: 'audit' });
  });
});
