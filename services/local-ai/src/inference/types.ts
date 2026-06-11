/** Proveedor de inferencia clínica (ADR-005). */
export type InferenceProviderId = 'ollama' | 'openai';

export type InferenceDataTier = 'L0_synthetic' | 'L1_deidentified' | 'L2_phi';

export type InferenceMode = 'ollama' | 'openai' | 'router';

export type StructuredGenerateResult =
  | { ok: true; text: string; model: string; provider: InferenceProviderId }
  | { ok: false; reason: string; provider: InferenceProviderId };

export type InferenceProvider = {
  id: InferenceProviderId;
  ping(): Promise<boolean>;
  generateStructuredJson(prompt: string, timeoutMs?: number): Promise<StructuredGenerateResult>;
};
