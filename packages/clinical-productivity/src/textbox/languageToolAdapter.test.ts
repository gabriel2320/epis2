import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEpisSpellcheckAdapter, createLanguageToolAdapter } from './languageToolAdapter.js';

describe('languageToolAdapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('mapea respuesta LanguageTool a sugerencias', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          matches: [
            {
              offset: 0,
              length: 8,
              replacements: [{ value: 'paciente' }],
            },
          ],
        }),
      })),
    );

    const adapter = createLanguageToolAdapter('http://127.0.0.1:8010/v2/check');
    const issues = await adapter.check('pacinete estable');
    expect(issues[0]?.token).toBe('pacinete');
    expect(issues[0]?.suggestions[0]).toBe('paciente');
  });

  it('createEpisSpellcheckAdapter cae al corrector local si API falla', async () => {
    const adapter = createEpisSpellcheckAdapter(async () => {
      throw new Error('offline');
    });
    const issues = await adapter.check('texto clínico');
    expect(Array.isArray(issues)).toBe(true);
  });
});
