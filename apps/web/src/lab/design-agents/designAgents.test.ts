/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import {
  CommandCenterCriticResultSchema,
  Md3LayoutCriticResultSchema,
  PatchPlanSchema,
} from './schemas.js';
import { areDesignAgentsEnabled } from './designAgentsEnv.js';
import { commandCenterAgent } from './commandCenterAgent.js';
import { md3LayoutCriticAgent } from './md3LayoutCriticAgent.js';

describe('design-agents schemas', () => {
  it('valida Md3LayoutCriticResultSchema', () => {
    const parsed = Md3LayoutCriticResultSchema.parse({
      score: 90,
      violations: [],
      suggestions: [],
      risk: 'low',
    });
    expect(parsed.score).toBe(90);
  });

  it('valida CommandCenterCriticResultSchema', () => {
    const parsed = CommandCenterCriticResultSchema.parse({
      score: 80,
      violations: [],
      suggestions: [],
      risk: 'low',
      googleBarLike: true,
      classicAccessVisible: true,
      maxSuggestionsRespected: true,
    });
    expect(parsed.googleBarLike).toBe(true);
  });

  it('valida PatchPlanSchema', () => {
    const parsed = PatchPlanSchema.parse({
      files: ['apps/web/src/pages/CommandCenterPage.tsx'],
      changes: ['Ajustar barra'],
      risks: ['Revisión humana'],
      testsRequired: ['CommandCenterPage.test.tsx'],
      gatesRequired: ['quality:command-center-googlebar-gate'],
    });
    expect(parsed.files.length).toBe(1);
  });
});

describe('design agents default', () => {
  it('quedan off por defecto', () => {
    expect(areDesignAgentsEnabled()).toBe(false);
  });

  it('commandCenterAgent heurístico pasa con testIds canónicos', async () => {
    const result = await commandCenterAgent({
      route: '/comando',
      pathname: '/comando',
      surface: 'command',
      mode: 'command-center',
      testIds: ['epis2-command-google-bar', 'epis2-command-classic-access'],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result.score).toBeGreaterThan(50);
      expect(result.result.classicAccessVisible).toBe(true);
    }
  });

  it('md3LayoutCriticAgent detecta shell clásico', async () => {
    const result = await md3LayoutCriticAgent({
      route: '/espacio/ficha?mode=classic',
      pathname: '/espacio/ficha',
      surface: 'workspace',
      mode: 'classic',
      scrollPolicy: 'main-pane-only',
      testIds: ['epis2-classic-md3-shell'],
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.result.violations).toHaveLength(0);
  });
});
