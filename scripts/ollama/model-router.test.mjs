/**
 * @vitest-environment node
 */
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { computeWorkstationTier, getWorkstationProfile } from './workstation-profile.mjs';
import { pickModelForFunction, getCandidates, OLLAMA_FUNCTIONS } from './model-router.mjs';

const INSTALLED = ['qwen3:8b', 'qwen2.5-coder:7b', 'qwen2.5-coder:14b', 'deepseek-coder-v2:16b'];

describe('workstation-profile', () => {
  it('computeWorkstationTier por RAM/VRAM', () => {
    expect(computeWorkstationTier(8, 0)).toBe('minimal');
    expect(computeWorkstationTier(16, 8)).toBe('standard');
    expect(computeWorkstationTier(64, 12)).toBe('performance');
    expect(computeWorkstationTier(64, 0)).toBe('performance');
  });

  it('EPIS2_WORKSTATION_TIER override', () => {
    process.env.EPIS2_WORKSTATION_TIER = 'minimal';
    expect(computeWorkstationTier(64, 12)).toBe('minimal');
  });

  afterEach(() => {
    delete process.env.EPIS2_WORKSTATION_TIER;
  });
});

describe('model-router', () => {
  beforeEach(() => {
    delete process.env.OLLAMA_ROUTE_MODE;
    delete process.env.OLLAMA_ROUTE_DEV_PLAN;
    delete process.env.OLLAMA_ROUTE_DEV_WRITE;
    delete process.env.OLLAMA_DEV_MODEL;
    delete process.env.OLLAMA_MODEL;
    delete process.env.EPIS2_WORKSTATION_TIER;
  });

  it('expone funciones canon', () => {
    expect(OLLAMA_FUNCTIONS).toContain('clinical');
    expect(OLLAMA_FUNCTIONS).toContain('dev-write');
  });

  it('clinical siempre qwen3:8b', () => {
    const r = pickModelForFunction('clinical', { tier: 'minimal', installedModels: INSTALLED });
    expect(r.model).toBe('qwen3:8b');
  });

  it('dev-write performance elige deepseek-coder-v2:16b', () => {
    const r = pickModelForFunction('dev-write', {
      tier: 'performance',
      installedModels: INSTALLED,
    });
    expect(r.model).toBe('deepseek-coder-v2:16b');
    expect(r.fallbackUsed).toBe(false);
  });

  it('dev-write minimal cae a 7b', () => {
    const r = pickModelForFunction('dev-write', { tier: 'minimal', installedModels: INSTALLED });
    expect(r.model).toBe('qwen2.5-coder:7b');
  });

  it('dev-write standard usa 14b si está', () => {
    const r = pickModelForFunction('dev-write', { tier: 'standard', installedModels: INSTALLED });
    expect(r.model).toBe('qwen2.5-coder:14b');
  });

  it('fallback cuando falta modelo preferido', () => {
    const r = pickModelForFunction('dev-write', {
      tier: 'performance',
      installedModels: ['qwen2.5-coder:7b', 'qwen3:8b'],
    });
    expect(r.model).toBe('qwen2.5-coder:7b');
    expect(r.fallbackUsed).toBe(true);
  });

  it('override por función', () => {
    process.env.OLLAMA_ROUTE_DEV_WRITE = 'qwen2.5-coder:7b';
    const r = pickModelForFunction('dev-write', {
      tier: 'performance',
      installedModels: INSTALLED,
    });
    expect(r.model).toBe('qwen2.5-coder:7b');
    expect(r.mode).toBe('override');
  });

  it('modo fixed usa OLLAMA_DEV_MODEL', () => {
    process.env.OLLAMA_ROUTE_MODE = 'fixed';
    process.env.OLLAMA_DEV_MODEL = 'deepseek-coder:6.7b';
    const r = pickModelForFunction('dev-write', {
      tier: 'performance',
      installedModels: INSTALLED,
    });
    expect(r.model).toBe('deepseek-coder:6.7b');
    expect(r.mode).toBe('fixed');
  });

  it('getCandidates tiene entradas por tier', () => {
    expect(getCandidates('dev-write', 'performance')[0]).toBe('deepseek-coder-v2:16b');
  });
});

describe('getWorkstationProfile', () => {
  it('retorna perfil numérico', () => {
    const p = getWorkstationProfile();
    expect(p.ramGb).toBeGreaterThan(0);
    expect(['minimal', 'standard', 'performance']).toContain(p.tier);
  });
});
