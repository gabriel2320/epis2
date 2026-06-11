import { describe, expect, it } from 'vitest';
import { buildCommandResolveContext } from './useCommandResolveContext.js';

describe('buildCommandResolveContext', () => {
  it('propaga chartMode=paper en patient_chart', () => {
    const ctx = buildCommandResolveContext('patient_chart', {
      pendingDraftCount: 0,
      activeAlertCount: 0,
      chartMode: 'paper',
    });
    expect(ctx.chartMode).toBe('paper');
    expect(ctx.workspace).toBe('patient_chart');
  });

  it('no propaga chartMode fuera de patient_chart', () => {
    const ctx = buildCommandResolveContext('command_center', {
      pendingDraftCount: 1,
      activeAlertCount: 0,
      chartMode: 'paper',
    });
    expect(ctx.chartMode).toBeUndefined();
    expect(ctx.pendingDraftCount).toBe(1);
  });
});
