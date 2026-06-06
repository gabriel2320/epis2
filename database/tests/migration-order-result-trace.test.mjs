import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '../migrations');

describe('026_order_result_trace migration', () => {
  it('añade clinical_order_id a observaciones y críticos', async () => {
    const sql = await readFile(join(migrationsDir, '026_order_result_trace.sql'), 'utf8');
    expect(sql).toContain('clinical_order_id');
    expect(sql).toContain('observations');
    expect(sql).toContain('clinical_critical_results');
  });
});
