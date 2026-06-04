import { describe, expect, it } from 'vitest';
import { getCommandChipsForRole, getCommandBarAiHint } from './chips.js';

describe('getCommandChipsForRole', () => {
  it('médico ve evolución y receta, no MAR', () => {
    const chips = getCommandChipsForRole('physician', [
      'command.execute',
      'dashboard.read',
    ]);
    const samples = chips.map((c) => c.sampleEs);
    expect(samples.some((s) => /evoluciona/.test(s))).toBe(true);
    expect(samples.some((s) => /\bmar\b/i.test(s))).toBe(false);
  });

  it('enfermería ve MAR y nota enfermería, no epicrisis', () => {
    const chips = getCommandChipsForRole('nurse', ['command.execute', 'dashboard.read']);
    const samples = chips.map((c) => c.sampleEs);
    expect(samples.some((s) => /mar|enfermeria|medicamento/.test(s))).toBe(true);
    expect(samples.some((s) => /epicrisis/.test(s))).toBe(false);
  });

  it('farmacia ve validación farmacéutica', () => {
    const chips = getCommandChipsForRole('pharmacist', ['command.execute', 'dashboard.read']);
    expect(chips.some((c) => /validacion farmaceutica/i.test(c.sampleEs))).toBe(true);
  });

  it('auditor ve tablero calidad sin comandos clínicos', () => {
    const chips = getCommandChipsForRole('auditor', ['audit.read', 'dashboard.read']);
    expect(chips.some((c) => /tablero de calidad|calidad/.test(c.sampleEs))).toBe(true);
    expect(chips.every((c) => c.intent.startsWith('open_dashboard') || c.aiAssisted)).toBe(true);
  });

  it('con IA añade hints asistidos por rol', () => {
    const chips = getCommandChipsForRole('nurse', ['command.execute'], { aiAvailable: true });
    expect(chips.some((c) => c.aiAssisted)).toBe(true);
  });
});

describe('getCommandBarAiHint', () => {
  it('devuelve mensaje distinto por rol', () => {
    expect(getCommandBarAiHint('physician', true)).toMatch(/evolución/i);
    expect(getCommandBarAiHint('nurse', true)).toMatch(/enfermería/i);
  });
});
