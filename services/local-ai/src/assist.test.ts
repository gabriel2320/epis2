import { describe, expect, it, vi } from 'vitest';
import * as ollama from './ollama.js';
import { runDraftAssist } from './assist.js';

describe('runDraftAssist', () => {
  it('devuelve unavailable si Ollama está apagado', async () => {
    vi.spyOn(ollama, 'pingOllama').mockResolvedValue(false);
    const result = await runDraftAssist('http://127.0.0.1:11434', 'llama3.2', {
      blueprintId: 'evolution_note',
    });
    expect(result.status).toBe('unavailable');
  });
});
