import { describe, expect, it } from 'vitest';
import { clinicalRoles } from './clinical-roles.js';

function hexToRgb(hex: string) {
  const n = hex.replace('#', '');
  return {
    r: parseInt(n.slice(0, 2), 16) / 255,
    g: parseInt(n.slice(2, 4), 16) / 255,
    b: parseInt(n.slice(4, 6), 16) / 255,
  };
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const linear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrastRatio(fg: string, bg: string) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('clinicalRoles contrast (WCAG AA)', () => {
  it('critical y approved cumplen contraste mínimo 4.5:1', () => {
    for (const key of ['critical', 'approved'] as const) {
      const role = clinicalRoles[key];
      expect(contrastRatio(role.onContainer, role.container)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(role.onMain, role.main)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
