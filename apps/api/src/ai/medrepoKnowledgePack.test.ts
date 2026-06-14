import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  getMedrepoAssistSafetyNotes,
  getMedrepoPackStatus,
  loadMedrepoKnowledgePack,
  resetMedrepoKnowledgePackCache,
} from './medrepoKnowledgePack.js';

describe('MF-FF-14 medrepoKnowledgePack', () => {
  afterEach(() => {
    delete process.env.MEDREPO_KNOWLEDGE_PACK_PATH;
    resetMedrepoKnowledgePackCache();
  });

  it('carga el fixture sintético demo por defecto', () => {
    const state = loadMedrepoKnowledgePack(true);
    expect(state.status).toBe('loaded');
    if (state.status !== 'loaded') return;
    expect(state.pack.packId).toBe('epis2-synthetic-demo-v1');
    expect(state.pack.safety.containsPatientData).toBe(false);
  });

  it('rechaza packs sin revisión humana', () => {
    const dir = mkdtempSync(join(tmpdir(), 'epis2-medrepo-'));
    const path = join(dir, 'unsafe-pack.json');
    writeFileSync(
      path,
      JSON.stringify({
        packId: 'unsafe',
        title: 'Unsafe',
        safety: { containsPatientData: false, humanReviewed: false },
      }),
    );
    process.env.MEDREPO_KNOWLEDGE_PACK_PATH = path;

    const state = loadMedrepoKnowledgePack(true);
    expect(state.status).toBe('unavailable');
    if (state.status === 'unavailable') {
      expect(state.reason).toContain('humanReviewed');
    }
  });

  it('devuelve hints MedRepo para campos con metformina', () => {
    const notes = getMedrepoAssistSafetyNotes('prescription', {
      medication: 'Metformina 850 mg',
    });
    expect(
      notes.some((n) => n.includes('[medrepo]') && n.toLowerCase().includes('metformina')),
    ).toBe(true);
  });

  it('expone status read-only sin PHI', () => {
    const status = getMedrepoPackStatus();
    expect(status.readOnly).toBe(true);
    if (status.enabled) {
      expect(status.chunkCount).toBeGreaterThan(0);
      expect(status).not.toHaveProperty('chunks');
    }
  });

  it('fixture demo existe en repo', () => {
    expect(
      existsSync(join(process.cwd(), 'apps/api/src/ai/fixtures/medrepo-knowledge-pack-demo.json')),
    ).toBe(true);
  });
});
