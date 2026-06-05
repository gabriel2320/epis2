import { describe, expect, it } from 'vitest';
import { buildMinimalPdf } from './minimalPdf.js';

describe('buildMinimalPdf', () => {
  it('genera PDF válido con cabecera', () => {
    const buf = buildMinimalPdf(['EPIS2 resumen demo', 'Linea dos']);
    const text = buf.toString('utf8');
    expect(text.startsWith('%PDF-1.4')).toBe(true);
    expect(text).toContain('%%EOF');
    expect(text).toContain('EPIS2 resumen demo');
  });
});
