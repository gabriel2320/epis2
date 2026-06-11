import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  consumeCommandAssistDraft,
  resolveAssistBlueprintForIntent,
  shouldInvokeCommandAssistDraft,
  stashCommandAssistDraft,
} from './commandAssistDraft.js';

const store = new Map<string, string>();

describe('commandAssistDraft MF-CM-06', () => {
  beforeEach(() => {
    store.clear();
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    });
  });

  it('resuelve blueprint por intent', () => {
    expect(resolveAssistBlueprintForIntent('create_evolution_draft')).toBe('evolution_note');
    expect(resolveAssistBlueprintForIntent('search_patient')).toBeUndefined();
  });

  it('solo invoca assist con IA disponible', () => {
    expect(shouldInvokeCommandAssistDraft('create_evolution_draft', true)).toBe(true);
    expect(shouldInvokeCommandAssistDraft('create_evolution_draft', false)).toBe(false);
    expect(shouldInvokeCommandAssistDraft('search_patient', true)).toBe(false);
  });

  it('stash y consume borrador por blueprint', () => {
    stashCommandAssistDraft('evolution_note', { subjective: 'demo' }, 'run-1');
    expect(consumeCommandAssistDraft('evolution_note')?.fields.subjective).toBe('demo');
    expect(consumeCommandAssistDraft('evolution_note')).toBeNull();
  });
});
