import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import SwaggerParser from '@apidevtools/swagger-parser';
import { describe, expect, it } from 'vitest';
import { buildOpenApiDocument } from './document.js';

const REQUIRED_PATHS = [
  '/api/auth/login',
  '/api/auth/session',
  '/api/drafts',
  '/api/drafts/{draftId}',
  '/api/patients',
  '/api/patients/{patientId}/documents/search',
] as const;

describe('OpenAPI document (MF-NORM-301)', () => {
  it('genera spec OpenAPI 3.1 válida con rutas auth/drafts/search', async () => {
    const doc = buildOpenApiDocument();
    const validated = (await SwaggerParser.validate(JSON.parse(JSON.stringify(doc)))) as {
      openapi?: string;
      paths?: Record<string, unknown>;
    };

    expect(String(validated.openapi)).toMatch(/^3\.1/);
    for (const path of REQUIRED_PATHS) {
      expect(validated.paths?.[path], `falta path ${path}`).toBeDefined();
    }

    const outDir = join(dirname(fileURLToPath(import.meta.url)), '../../../../reports');
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'openapi.json'), `${JSON.stringify(validated, null, 2)}\n`, 'utf8');
  });

  it('expone envelope ApiError en components', () => {
    const doc = buildOpenApiDocument();
    const components = doc.components as { schemas?: Record<string, unknown> } | undefined;
    expect(components?.schemas?.ApiError).toBeDefined();
  });
});
