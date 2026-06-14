import { listAssistBlueprints } from './assistSchemas.js';
import type { AiConfig } from './config.js';
import { listDraftPromptSpecs, PROMPT_CATALOG_VERSION } from './draftPromptCatalog.js';

const AI_DISCLAIMER =
  'Asistencia IA — borrador sugerido; requiere revisión humana antes de aprobar.';

export type LocalAiCapabilities = {
  operational: boolean;
  provider: 'ollama' | 'openai' | 'router';
  inferenceMode: AiConfig['AI_INFERENCE_MODE'];
  cloudEnabled: boolean;
  providers: {
    ollama: 'up' | 'down';
    openai: 'up' | 'down' | 'disabled';
  };
  structuredSchemas: string[];
  clinicalPromptIds: string[];
  promptCatalogVersion: string;
  capabilities: {
    draftAssist: boolean;
    commandRouteAssist: boolean;
    embedDocument: boolean;
    chat: false;
    toolCalling: false;
    rag: false;
  };
  disclaimer: string;
};

export function buildLocalAiCapabilities(
  config: AiConfig,
  ollamaUp: boolean,
  openaiUp: boolean,
): LocalAiCapabilities {
  const cloudConfigured = config.AI_CLOUD_ENABLED && Boolean(config.OPENAI_API_KEY?.trim());
  const operational = ollamaUp || (cloudConfigured && openaiUp);

  return {
    operational,
    provider: config.AI_INFERENCE_MODE === 'router' ? 'router' : config.AI_INFERENCE_MODE,
    inferenceMode: config.AI_INFERENCE_MODE,
    cloudEnabled: config.AI_CLOUD_ENABLED,
    providers: {
      ollama: ollamaUp ? 'up' : 'down',
      openai: !cloudConfigured ? 'disabled' : openaiUp ? 'up' : 'down',
    },
    structuredSchemas: listAssistBlueprints().map((b) => b.id),
    clinicalPromptIds: listDraftPromptSpecs().map((p) => p.blueprintId),
    promptCatalogVersion: PROMPT_CATALOG_VERSION,
    capabilities: {
      draftAssist: operational,
      commandRouteAssist: ollamaUp,
      embedDocument: ollamaUp,
      chat: false,
      toolCalling: false,
      rag: false,
    },
    disclaimer: AI_DISCLAIMER,
  };
}
