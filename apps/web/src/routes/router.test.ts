import { describe, expect, it } from 'vitest';
import { EPIS2_COMMAND_CENTER_HOME } from './router.js';

describe('router', () => {
  it('define /comando como home del Centro de Comando', () => {
    expect(EPIS2_COMMAND_CENTER_HOME).toBe('/comando');
  });
});
