import { describe, expect, it } from 'vitest';
import { listAssistBlueprints } from './assistSchemas.js';
import { loadAiConfig } from './config.js';
import { buildLocalAiCapabilities } from './gatewayCapabilities.js';

const baseConfig = loadAiConfig({
  AI_INFERENCE_MODE: 'router',
  AI_CLOUD_ENABLED: 'false',
});

describe('local-ai gateway capabilities (EPIDOS pattern)', () => {
  it('expone blueprints MVP y V3 como structuredSchemas', () => {
    const ids = listAssistBlueprints().map((b) => b.id);
    expect(ids).toContain('evolution_note');
    expect(ids).toContain('lab_request');
    expect(ids).toContain('nursing_note');
    expect(ids).toContain('medication_administration');
    expect(ids).toContain('pharmacy_validation');
    expect(ids).toContain('medication_reconciliation');
    expect(ids).toContain('procedure_request');
    expect(ids.length).toBe(16);
  });

  it('marca chat, tools y RAG deshabilitados', () => {
    const caps = buildLocalAiCapabilities(baseConfig, false, false);
    expect(caps.capabilities.chat).toBe(false);
    expect(caps.capabilities.toolCalling).toBe(false);
    expect(caps.capabilities.rag).toBe(false);
    expect(caps.capabilities.commandRouteAssist).toBe(false);
    expect(caps.capabilities.embedDocument).toBe(false);
    expect(caps.clinicalPromptIds.length).toBe(15);
    expect(caps.promptCatalogVersion).toBe('epis2-prompts-v1.1');
    expect(caps.operational).toBe(false);
    expect(caps.inferenceMode).toBe('router');
    expect(caps.providers.openai).toBe('disabled');
  });

  it('operacional con ollama up o openai up en router', () => {
    expect(buildLocalAiCapabilities(baseConfig, true, false).operational).toBe(true);
    const cloudConfig = loadAiConfig({
      AI_INFERENCE_MODE: 'router',
      AI_CLOUD_ENABLED: 'true',
      OPENAI_API_KEY: 'sk-test',
    });
    expect(buildLocalAiCapabilities(cloudConfig, false, true).operational).toBe(true);
  });
});
