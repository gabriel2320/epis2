import { describe, expect, it } from 'vitest';
import { listAssistBlueprints } from './assistSchemas.js';
import { buildLocalAiCapabilities } from './gatewayCapabilities.js';

describe('local-ai gateway capabilities (EPIDOS pattern)', () => {
  it('expone blueprints MVP y V3 como structuredSchemas', () => {
    const ids = listAssistBlueprints().map((b) => b.id);
    expect(ids).toContain('evolution_note');
    expect(ids).toContain('lab_request');
    expect(ids).toContain('nursing_note');
    expect(ids).toContain('medication_administration');
    expect(ids).toContain('pharmacy_validation');
    expect(ids.length).toBe(7);
  });

  it('marca chat, tools y RAG deshabilitados', () => {
    const caps = buildLocalAiCapabilities(false);
    expect(caps.capabilities.chat).toBe(false);
    expect(caps.capabilities.toolCalling).toBe(false);
    expect(caps.capabilities.rag).toBe(false);
    expect(caps.clinicalPromptIds.length).toBe(7);
    expect(caps.promptCatalogVersion).toBe('epis2-prompts-v1.1');
    expect(caps.operational).toBe(false);
  });
});
