import type { AiConfig } from '../config.js';
import { createOllamaProvider } from './ollamaProvider.js';
import { createOpenAiProvider } from './openaiProvider.js';
import {
  cloudAllowedForTier,
  resolveProviderChain,
  resolveRequestDataTier,
  type InferencePolicyConfig,
} from './policy.js';
import type { InferenceProvider, InferenceProviderId, StructuredGenerateResult } from './types.js';

export function buildInferencePolicyConfig(config: AiConfig): InferencePolicyConfig {
  return {
    mode: config.AI_INFERENCE_MODE,
    cloudEnabled: config.AI_CLOUD_ENABLED,
    hasOpenAiKey: Boolean(config.OPENAI_API_KEY?.trim()),
    defaultDataTier: config.AI_DEFAULT_DATA_TIER,
  };
}

export function createInferenceProviders(config: AiConfig): Map<InferenceProviderId, InferenceProvider> {
  const map = new Map<InferenceProviderId, InferenceProvider>();
  map.set('ollama', createOllamaProvider(config.OLLAMA_BASE_URL, config.OLLAMA_MODEL));
  if (config.OPENAI_API_KEY?.trim()) {
    map.set(
      'openai',
      createOpenAiProvider(config.OPENAI_API_KEY, config.OPENAI_MODEL, config.OPENAI_BASE_URL),
    );
  }
  return map;
}

export async function generateWithInferenceRouter(
  config: AiConfig,
  prompt: string,
  requestContext: Record<string, string> | undefined,
  timeoutMs = 45_000,
): Promise<StructuredGenerateResult & { dataTier: ReturnType<typeof resolveRequestDataTier> }> {
  const policy = buildInferencePolicyConfig(config);
  const dataTier = resolveRequestDataTier(requestContext, policy.defaultDataTier);

  if (!cloudAllowedForTier(dataTier, policy.cloudEnabled) && policy.mode === 'openai') {
    return {
      ok: false,
      reason: 'Inferencia cloud no permitida para este tier de dato',
      provider: 'openai',
      dataTier,
    };
  }

  const chain = resolveProviderChain(policy, dataTier);
  if (chain.length === 0) {
    return {
      ok: false,
      reason: 'Inferencia cloud no configurada (AI_CLOUD_ENABLED + OPENAI_API_KEY)',
      provider: 'openai',
      dataTier,
    };
  }

  const providers = createInferenceProviders(config);
  let lastFailure: StructuredGenerateResult = {
    ok: false,
    reason: 'Ningún proveedor de inferencia disponible',
    provider: chain[0] ?? 'ollama',
  };

  for (const id of chain) {
    const provider = providers.get(id);
    if (!provider) continue;
    const up = await provider.ping();
    if (!up) {
      lastFailure = {
        ok: false,
        reason:
          id === 'ollama'
            ? 'Ollama no está disponible. Continúa con el formulario manual.'
            : 'OpenAI no está disponible',
        provider: id,
      };
      continue;
    }
    const result = await provider.generateStructuredJson(prompt, timeoutMs);
    if (result.ok) {
      return { ...result, dataTier };
    }
    lastFailure = result;
  }

  return { ...lastFailure, dataTier };
}
