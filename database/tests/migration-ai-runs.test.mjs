import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'migrations',
  '005_ai_runs.sql',
);

describe('005_ai_runs migration', () => {
  it('define tabla ai_runs con prompt_hash y latencia', async () => {
    const sql = await readFile(migrationPath, 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS ai_runs');
    expect(sql).toContain('prompt_hash');
    expect(sql).toContain('latency_ms');
    expect(sql).toContain('model');
  });
});
