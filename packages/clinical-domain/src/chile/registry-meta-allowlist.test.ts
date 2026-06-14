import { describe, expect, it } from 'vitest';
import {
  CHILE_REGISTRY_META_ALLOWLIST,
  CHILE_RUT_REGISTRY_META_KEYS,
  CHILE_SNRE_REGISTRY_META_KEYS,
  isChileRegistryMetaKey,
} from './registry-meta-allowlist.js';

describe('MF-SH-04 — CHILE registry meta allowlist', () => {
  it('incluye claves SNRE y RUT', () => {
    expect(CHILE_SNRE_REGISTRY_META_KEYS).toContain('rx.medication');
    expect(CHILE_RUT_REGISTRY_META_KEYS).toContain('patient.rut');
    expect(CHILE_REGISTRY_META_ALLOWLIST.length).toBeGreaterThanOrEqual(10);
  });

  it('rechaza claves fuera de allowlist', () => {
    expect(isChileRegistryMetaKey('rx.medication')).toBe(true);
    expect(isChileRegistryMetaKey('patient.rut')).toBe(true);
    expect(isChileRegistryMetaKey('legacy.epis.field')).toBe(false);
  });
});
