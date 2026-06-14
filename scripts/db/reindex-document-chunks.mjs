#!/usr/bin/env node
/**
 * MF-IM-01 — Re-index demo: rellena embedding_384 desde chunk_text (o pool 128→384).
 *
 *   npm run db:reindex-chunks
 *   npm run db:reindex-chunks -- --dry-run
 */
import postgres from 'postgres';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { resolveMigrateDatabaseUrl } from '../db-url.mjs';
import {
  demoEmbedToPgVectorLiteral,
  resolveEmbedding384FromChunkText,
} from './document-chunk-embed.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dryRun = process.argv.includes('--dry-run');

async function main() {
  const url = resolveMigrateDatabaseUrl();
  if (!url) {
    console.error('db:reindex-chunks FAILED: DATABASE_URL o DATABASE_MIGRATE_URL no definida');
    process.exit(1);
  }

  const sql = postgres(url, { max: 1 });
  try {
    const [{ exists }] = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'clinical_document_chunks'
          AND column_name = 'embedding_384'
      ) AS exists
    `;
    if (!exists) {
      console.error('db:reindex-chunks FAILED: falta columna embedding_384 — aplicar migración 046');
      process.exit(1);
    }

    const rows = await sql`
      SELECT id, chunk_text, embedding::text AS embedding_text
      FROM clinical_document_chunks
      ORDER BY document_id, chunk_index
    `;

    if (rows.length === 0) {
      console.log('db:reindex-chunks — sin chunks');
      return;
    }

    let updated = 0;
    for (const row of rows) {
      const legacy128 = parsePgVector(row.embedding_text);
      const dim384 = resolveEmbedding384FromChunkText(row.chunk_text, legacy128);
      const literal = demoEmbedToPgVectorLiteral(dim384);
      if (dryRun) {
        console.log(`[dry-run] ${row.id} → 384d (${dim384.length})`);
        updated++;
        continue;
      }
      await sql`
        UPDATE clinical_document_chunks
        SET embedding_384 = ${literal}::vector
        WHERE id = ${row.id}::uuid
      `;
      updated++;
    }

    console.log(
      `db:reindex-chunks OK — ${updated} chunk(s)${dryRun ? ' (dry-run)' : ''} · root=${root}`,
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

/** @param {string | null | undefined} text */
function parsePgVector(text) {
  if (!text) return null;
  const inner = text.replace(/^\[/, '').replace(/\]$/, '').trim();
  if (!inner) return [];
  return inner.split(',').map((n) => Number(n.trim()));
}

main().catch((err) => {
  console.error('db:reindex-chunks FAILED:', err.message ?? err);
  process.exit(1);
});
