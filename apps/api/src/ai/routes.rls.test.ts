import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./routes.ts', import.meta.url), 'utf8');

describe('AI routes RLS boundary', () => {
  it('envuelve lectura de ai_runs con runWithRlsContext', () => {
    expect(source).toMatch(
      /runWithRlsContext\(db,\s*config,\s*session,\s*\(tx\)\s*=>\s*[\s\S]*listRecentAiRuns\(tx,/,
    );
  });

  it('envuelve RAG clinico con runWithRlsContext', () => {
    expect(source).toMatch(
      /runWithRlsContext\(db,\s*config,\s*session,\s*\(tx\)\s*=>\s*[\s\S]*queryPatientRag\(\s*tx,/,
    );
  });

  it('no persiste prompt de RAG como texto plano en ai_runs', () => {
    expect(source).not.toContain('inputPayload: { question }');
  });
});
