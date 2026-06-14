import type { InferenceDataTier, InferenceMode, InferenceProviderId } from './types.js';

export type InferencePolicyConfig = {
  mode: InferenceMode;
  cloudEnabled: boolean;
  hasOpenAiKey: boolean;
  defaultDataTier: InferenceDataTier;
};

const DEMO_MARKERS = [/demo/i, /sint[eé]tico/i, /DEMO-/];

/** Infiere tier de dato desde contexto de request (demo → L0). */
export function resolveRequestDataTier(
  context: Record<string, string> | undefined,
  defaultTier: InferenceDataTier,
): InferenceDataTier {
  const blob = JSON.stringify(context ?? {});
  if (DEMO_MARKERS.some((re) => re.test(blob))) {
    return 'L0_synthetic';
  }
  return defaultTier;
}

/** Cloud bloqueado para L2_phi hasta BAA explícito (fail-closed). */
export function cloudAllowedForTier(tier: InferenceDataTier, cloudEnabled: boolean): boolean {
  if (!cloudEnabled) return false;
  return tier === 'L0_synthetic' || tier === 'L1_deidentified';
}

/** Cadena de proveedores según modo + policy. */
export function resolveProviderChain(
  config: InferencePolicyConfig,
  dataTier: InferenceDataTier,
): InferenceProviderId[] {
  const cloudOk = cloudAllowedForTier(dataTier, config.cloudEnabled) && config.hasOpenAiKey;

  if (config.mode === 'openai') {
    return cloudOk ? ['openai'] : [];
  }
  if (config.mode === 'ollama') {
    return ['ollama'];
  }
  // router: local first, cloud fallback
  return cloudOk ? ['ollama', 'openai'] : ['ollama'];
}
