import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('046_rag_embeddings_384 migration', () => {
  it('añade columna embedding_384 e índice HNSW', async () => {
    const sql = await readFile(join(migrationsDir, '046_rag_embeddings_384.sql'), 'utf8');
    expect(sql).toContain('embedding_384 vector(384)');
    expect(sql).toContain('idx_doc_chunks_embedding_384_hnsw');
    expect(sql).toContain('epis2-rag-embeddings-384');
  });
});
