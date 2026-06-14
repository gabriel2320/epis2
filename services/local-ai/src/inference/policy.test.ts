import { describe, expect, it } from 'vitest';
import { cloudAllowedForTier, resolveProviderChain, resolveRequestDataTier } from './policy.js';

describe('inference policy (ADR-005)', () => {
  it('marca demo como L0_synthetic', () => {
    expect(resolveRequestDataTier({ patientLabel: 'DEMO-PACIENTE' }, 'L2_phi')).toBe(
      'L0_synthetic',
    );
  });

  it('bloquea cloud para L2_phi', () => {
    expect(cloudAllowedForTier('L2_phi', true)).toBe(false);
    expect(cloudAllowedForTier('L0_synthetic', true)).toBe(true);
  });

  it('router usa ollama primero y openai como fallback', () => {
    const chain = resolveProviderChain(
      { mode: 'router', cloudEnabled: true, hasOpenAiKey: true, defaultDataTier: 'L0_synthetic' },
      'L0_synthetic',
    );
    expect(chain).toEqual(['ollama', 'openai']);
  });

  it('modo ollama solo usa local', () => {
    const chain = resolveProviderChain(
      { mode: 'ollama', cloudEnabled: true, hasOpenAiKey: true, defaultDataTier: 'L0_synthetic' },
      'L0_synthetic',
    );
    expect(chain).toEqual(['ollama']);
  });

  it('modo openai sin cloud habilitado devuelve cadena vacía', () => {
    const chain = resolveProviderChain(
      { mode: 'openai', cloudEnabled: false, hasOpenAiKey: true, defaultDataTier: 'L0_synthetic' },
      'L0_synthetic',
    );
    expect(chain).toEqual([]);
  });
});
