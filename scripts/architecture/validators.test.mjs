import { describe, it, expect } from 'vitest';
import { validate as noLegacy } from './no-legacy-dependencies.mjs';
import { validate as invariants } from './main-product-invariants.mjs';
import { validate as singleCommand } from './single-command-registry.mjs';
import { validate as noDirectMui } from './no-direct-mui-imports.mjs';
import { validate as devCatalogGates } from './dev-catalog-gates.mjs';

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

  it('no-direct-mui-imports pasa en repo limpio', async () => {
    const result = await noDirectMui();
    expect(result.ok, result.details?.join('\n')).toBe(true);
  });

  it('dev-catalog-gates (MUI-G15) pasa en repo limpio', async () => {
    const result = await devCatalogGates();
    expect(result.ok, result.details?.join('\n')).toBe(true);
  });

  it('monorepo-governance (MF-CON-03) pasa en repo limpio', async () => {
    const { validate: monorepoGovernance } = await import('./monorepo-governance.mjs');
    const result = await monorepoGovernance();
    expect(result.ok, result.details?.join('\n')).toBe(true);
  });
});
