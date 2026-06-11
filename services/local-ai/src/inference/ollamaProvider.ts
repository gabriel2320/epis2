import { generateOllamaJson, pingOllama } from '../ollama.js';
import type { InferenceProvider } from './types.js';

export function createOllamaProvider(baseUrl: string, model: string): InferenceProvider {
  return {
    id: 'ollama',
    ping: () => pingOllama(baseUrl),
    generateStructuredJson: async (prompt, timeoutMs) => {
      const result = await generateOllamaJson(baseUrl, prompt, model, timeoutMs);
      if (!result.ok) {
        return { ok: false, reason: result.reason, provider: 'ollama' };
      }
      return { ok: true, text: result.text, model: result.model, provider: 'ollama' };
    },
  };
}
