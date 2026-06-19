import { describe, expect, it } from 'vitest';
import {
  auditClinicalLayout,
  auditCicaScreen,
  resolveCicaVerdict,
  getFieldSpan,
  normalizeClinicalActions,
  type ClinicalLayoutAction,
} from './clinicalLayoutEngine.js';

describe('clinicalLayoutEngine', () => {
  it('normalizeClinicalActions — 1 primaria, 2 secundarias, resto overflow', () => {
    const actions: ClinicalLayoutAction[] = [
      { id: 'p1', label: 'P1', kind: 'primary', onClick: () => {} },
      { id: 'p2', label: 'P2', kind: 'primary', onClick: () => {} },
      { id: 's1', label: 'S1', kind: 'secondary', onClick: () => {} },
      { id: 's2', label: 'S2', kind: 'secondary', onClick: () => {} },
      { id: 's3', label: 'S3', kind: 'quiet', onClick: () => {} },
      { id: 's4', label: 'S4', kind: 'quiet', onClick: () => {} },
    ];
    const normalized = normalizeClinicalActions(actions);
    expect(normalized.primary).toHaveLength(1);
    expect(normalized.visibleSecondary).toHaveLength(2);
    expect(normalized.overflow).toHaveLength(2);
  });

  it('getFieldSpan — textarea ocupa 12 columnas', () => {
    expect(getFieldSpan('textarea')).toEqual({ xs: 12, md: 12 });
    expect(getFieldSpan('short')).toEqual({ xs: 12, md: 3 });
  });

  it('auditClinicalLayout — score GO sin hallazgos', () => {
    const { findings, score } = auditClinicalLayout({
      primaryButtons: 1,
      visibleActions: 3,
      cardDepth: 1,
      hasHorizontalOverflow: false,
      hasClinicalScreen: true,
      hasClinicalActionBar: true,
      paperStandaloneRoute: true,
      paperDayNav: true,
    });
    expect(findings).toHaveLength(0);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  it('auditCicaScreen — system workspace buscar/censo score GO', () => {
    const base = {
      systemWorkspace: true as const,
      patientIdentityVisible: false,
      hasReturnNavigation: true,
      primaryButtons: 1,
      documentStateVisible: true,
      hasUniqueIntent: true,
      visibleNavElements: 5,
      hasTransversalCommandBar: false,
      primaryContentBlocks: 3,
    };
    for (const screenId of ['patient-search', 'census']) {
      const primaryButtons = screenId === 'census' ? 0 : 1;
      const { score, verdict, findings } = auditCicaScreen({ ...base, primaryButtons });
      expect(findings, screenId).toHaveLength(0);
      expect(score, screenId).toBeGreaterThanOrEqual(90);
      expect(verdict, screenId).toBe('GO');
    }
  });

  it('auditCicaScreen — pantalla correcta score GO', () => {
    const { findings, score, verdict } = auditCicaScreen({
      patientIdentityVisible: true,
      hasReturnNavigation: true,
      primaryButtons: 1,
      documentStateVisible: true,
      hasUniqueIntent: true,
      visibleNavElements: 6,
      hasTransversalCommandBar: true,
      primaryContentBlocks: 5,
    });
    expect(findings).toHaveLength(0);
    expect(score).toBeGreaterThanOrEqual(90);
    expect(verdict).toBe('GO');
  });

  it('resolveCicaVerdict — umbrales CICA-L', () => {
    expect(resolveCicaVerdict(92)).toBe('GO');
    expect(resolveCicaVerdict(85)).toBe('PASS_WITH_FIXES');
    expect(resolveCicaVerdict(70)).toBe('NO-GO');
  });
});
