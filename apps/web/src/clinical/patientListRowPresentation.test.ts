import { describe, expect, it } from 'vitest';
import { patientListRowMeta } from './patientListRowPresentation.js';

describe('patientListRowPresentation', () => {
  it('patientListRowMeta compone setting, demo y pendiente', () => {
    const meta = patientListRowMeta({
      id: 'p1',
      displayName: 'Ana',
      demoCaseCode: 'DEMO-ICU-01',
      demoLabel: 'Demo',
    } as never);

    expect(meta).toContain('DEMO-ICU-01');
  });
});
