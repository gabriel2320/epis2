import { describe, it, expect } from 'vitest';
import { validate as noLegacy } from './no-legacy-dependencies.mjs';
import { validate as invariants } from './main-product-invariants.mjs';
import { validate as singleCommand } from './single-command-registry.mjs';

describe('architecture validators (smoke)', () => {
  it('main-product-invariants pasa en repo limpio', async () => {
    const result = await invariants();
    expect(result.ok, result.details?.join('\n')).toBe(true);
  });

  it('no-legacy-dependencies pasa en repo limpio', async () => {
    const result = await noLegacy();
    expect(result.ok, result.details?.join('\n')).toBe(true);
  });

  it('single-command-registry pasa en repo limpio', async () => {
    const result = await singleCommand();
    expect(result.ok, result.details?.join('\n')).toBe(true);
  });
});
