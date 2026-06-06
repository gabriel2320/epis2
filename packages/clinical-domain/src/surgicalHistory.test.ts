import { describe, expect, it } from 'vitest';
import {
  formatSurgicalHistoryDescription,
  isSurgicalHistoryDescription,
  stripSurgicalHistoryPrefix,
} from './surgicalHistory.js';

describe('surgicalHistory', () => {
  it('marca y desmarca prefijo Ant.Qx', () => {
    expect(formatSurgicalHistoryDescription('Apendicectomía 2018')).toBe(
      '[Ant.Qx] Apendicectomía 2018',
    );
    expect(isSurgicalHistoryDescription('[Ant.Qx] Apendicectomía 2018')).toBe(true);
    expect(stripSurgicalHistoryPrefix('[Ant.Qx] Apendicectomía 2018')).toBe('Apendicectomía 2018');
  });
});
