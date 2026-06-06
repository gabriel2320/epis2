import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  INTEGRATION_TEST_SUITES,
  INTEGRATION_DATABASE_DOC,
  hasIntegrationDatabase,
} from '@epis2/test-fixtures';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('CI test parity (MF-153)', () => {
  it('documenta DATABASE_URL para integración', () => {
    expect(existsSync(join(ROOT, INTEGRATION_DATABASE_DOC))).toBe(true);
    const doc = readFileSync(join(ROOT, INTEGRATION_DATABASE_DOC), 'utf8');
    expect(doc).toContain('DATABASE_URL');
    expect(doc).toContain('quality:ci-parity');
  });

  it('enumera las suites de integración', () => {
    expect(INTEGRATION_TEST_SUITES).toHaveLength(12);
    for (const rel of INTEGRATION_TEST_SUITES) {
      expect(existsSync(join(ROOT, rel))).toBe(true);
    }
  });

  it('hasIntegrationDatabase refleja env', () => {
    const expected = Boolean(process.env.DATABASE_URL?.trim());
    expect(hasIntegrationDatabase()).toBe(expected);
  });
});
