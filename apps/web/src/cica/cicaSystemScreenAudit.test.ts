import { describe, expect, it } from 'vitest';
import { auditCicaCensusScreen, auditCicaPatientSearchScreen } from './cicaSystemScreenAudit.js';

describe('CICA-L-01 system screen audit', () => {
  it('buscar score GO', () => {
    const { score, verdict, findings } = auditCicaPatientSearchScreen();
    expect(findings).toHaveLength(0);
    expect(score).toBeGreaterThanOrEqual(90);
    expect(verdict).toBe('GO');
  });

  it('censo score GO', () => {
    const { score, verdict, findings } = auditCicaCensusScreen();
    expect(findings).toHaveLength(0);
    expect(score).toBeGreaterThanOrEqual(90);
    expect(verdict).toBe('GO');
  });
});
