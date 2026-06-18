import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseCicaScreenRegistry } from './export-route-map.mjs';

const registryPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts',
);

describe('parseCicaScreenRegistry', () => {
  it('parses all CICA screens with stub classification', () => {
    const screens = parseCicaScreenRegistry(readFileSync(registryPath, 'utf8'));
    expect(screens.length).toBeGreaterThanOrEqual(25);
    for (const stub of ['recent-patients', 'my-work', 'agenda']) {
      const row = screens.find((s) => s.screenId === stub);
      expect(row?.status).toBe('HIDE_STUB');
      expect(row?.navVisible).toBe(false);
    }
    expect(screens.find((s) => s.screenId === 'patient-search')?.status).toBe('KEEP_CANONICAL');
  });
});
