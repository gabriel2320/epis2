import { describe, expect, it } from 'vitest';
import {
  auditPaperVisualArtifacts,
  PAPER_VISUAL_AUDIT_MIN_SCORE,
  paperVisualAuditPasses,
} from './PaperVisualAudit.js';

describe('PaperVisualAudit MF-PAPER-09', () => {
  it('cumple umbral mínimo 0.92', () => {
    const result = auditPaperVisualArtifacts();
    expect(result.score).toBeGreaterThanOrEqual(PAPER_VISUAL_AUDIT_MIN_SCORE);
    expect(paperVisualAuditPasses(result)).toBe(true);
  });

  it('detecta clase epis2-paper-page y grilla basal', () => {
    const result = auditPaperVisualArtifacts();
    expect(result.hasPaperPageClass).toBe(true);
    expect(result.hasBaselineGrid).toBe(true);
    expect(result.hasPrintMediaRules).toBe(true);
    expect(result.hasCalmPaperCanvas).toBe(true);
    expect(result.hasPlannerCommandHints).toBe(true);
  });

  it('footer visible en impresión (no epis2-paper-chart-no-print)', () => {
    const result = auditPaperVisualArtifacts();
    expect(result.noPrintHideOnFooter).toBe(true);
  });
});
