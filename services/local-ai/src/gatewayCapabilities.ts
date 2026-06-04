import { listAssistBlueprints } from './assistSchemas.js';

const AI_DISCLAIMER =
  'Asistencia IA local — borrador sugerido; requiere revisión humana antes de aprobar.';

export type LocalAiCapabilities = {
  operational: boolean;
  provider: 'ollama';
  structuredSchemas: string[];
  capabilities: {
    draftAssist: boolean;
    chat: false;
    toolCalling: false;
  };
  disclaimer: string;
};

export function buildLocalAiCapabilities(ollamaUp: boolean): LocalAiCapabilities {
  return {
    operational: ollamaUp,
    provider: 'ollama',
    structuredSchemas: listAssistBlueprints().map((b) => b.id),
    capabilities: {
      draftAssist: ollamaUp,
      chat: false,
      toolCalling: false,
    },
    disclaimer: AI_DISCLAIMER,
  };
}
