import { describe, expect, it, vi } from 'vitest';
import { loadAiConfig } from './config.js';
import { runDraftAssist } from './assist.js';
import * as router from './inference/router.js';

describe('runDraftAssist', () => {
  it('devuelve unavailable si el router no obtiene inferencia', async () => {
    vi.spyOn(router, 'generateWithInferenceRouter').mockResolvedValue({
      ok: false,
      reason: 'Ollama no está disponible. Continúa con el formulario manual.',
      provider: 'ollama',
      dataTier: 'L0_synthetic',
    });

    const config = loadAiConfig({
      AI_INFERENCE_MODE: 'ollama',
      OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
      OLLAMA_MODEL: 'test',
    });

    const result = await runDraftAssist(config, { blueprintId: 'evolution_note' });
    expect(result.status).toBe('unavailable');
  });

  it('MF-SH-03 — mensaje guía formulario manual cuando Ollama cae', async () => {
    vi.spyOn(router, 'generateWithInferenceRouter').mockResolvedValue({
      ok: false,
      reason: 'Ollama no está disponible. Continúa con el formulario manual.',
      provider: 'ollama',
      dataTier: 'L0_synthetic',
    });

    const config = loadAiConfig({
      AI_INFERENCE_MODE: 'ollama',
      OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
      OLLAMA_MODEL: 'test',
    });

    const result = await runDraftAssist(config, { blueprintId: 'evolution_note' });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.message.toLowerCase()).toMatch(/manual|formulario/);
    }
  });

  it('propaga provider y dataTier en éxito', async () => {
    vi.spyOn(router, 'generateWithInferenceRouter').mockResolvedValue({
      ok: true,
      text: JSON.stringify({
        suggestedFields: { subjective: 'Paciente estable' },
        safetyNotes: ['Revisar alergias'],
        requiresHumanReview: true,
      }),
      model: 'gpt-4o-mini',
      provider: 'openai',
      dataTier: 'L0_synthetic',
    });

    const config = loadAiConfig({
      AI_INFERENCE_MODE: 'router',
      AI_CLOUD_ENABLED: 'true',
      OPENAI_API_KEY: 'sk-test',
    });

    const result = await runDraftAssist(config, { blueprintId: 'evolution_note' });
    expect(result.status).toBe('success');
    if (result.status === 'success') {
      expect(result.provider).toBe('openai');
      expect(result.dataTier).toBe('L0_synthetic');
    }
  });
  it('rechaza JSON invalido generado por el proveedor', async () => {
    vi.spyOn(router, 'generateWithInferenceRouter').mockResolvedValue({
      ok: true,
      text: 'esto no es json',
      model: 'qwen3:8b',
      provider: 'ollama',
      dataTier: 'L2_phi',
    });

    const config = loadAiConfig({
      AI_INFERENCE_MODE: 'ollama',
      OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
      OLLAMA_MODEL: 'qwen3:8b',
    });

    const result = await runDraftAssist(config, { blueprintId: 'evolution_note' });

    expect(result.status).toBe('rejected');
    if (result.status === 'rejected') {
      expect(result.message).toMatch(/JSON/);
      expect(result.model).toBe('qwen3:8b');
      expect(result.provider).toBe('ollama');
    }
  });
});
