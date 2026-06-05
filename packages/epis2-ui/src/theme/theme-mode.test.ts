import { describe, expect, it } from 'vitest';
import { resolveEffectiveThemeMode } from './theme-mode.js';

describe('resolveEffectiveThemeMode', () => {
  it('resuelve system según preferencia del SO', () => {
    expect(resolveEffectiveThemeMode('system', false)).toBe('light');
    expect(resolveEffectiveThemeMode('system', true)).toBe('dark');
  });

  it('mantiene light y dark explícitos', () => {
    expect(resolveEffectiveThemeMode('light', true)).toBe('light');
    expect(resolveEffectiveThemeMode('dark', false)).toBe('dark');
  });
});
