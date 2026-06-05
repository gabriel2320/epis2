import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('019_v1_pgvector_documents migration', () => {
  it('habilita pgvector y tabla de chunks', async () => {
    const sql = await readFile(join(migrationsDir, '019_v1_pgvector_documents.sql'), 'utf8');
    expect(sql).toContain('CREATE EXTENSION IF NOT EXISTS vector');
    expect(sql).toContain('clinical_document_chunks');
    expect(sql).toContain('epis2-v1-pgvector');
  });
});

describe('020_v1_document_chunks_seed migration', () => {
  it('siembra contenido y embeddings demo', async () => {
    const sql = await readFile(join(migrationsDir, '020_v1_document_chunks_seed.sql'), 'utf8');
    expect(sql).toContain('text_content');
    expect(sql).toContain('clinical_document_chunks');
    expect(sql).toContain('::vector');
  });
});
