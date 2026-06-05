import { describe, expect, it } from 'vitest';
import { extractDemoOcrText } from './ocrDemo.js';

describe('extractDemoOcrText', () => {
  it('genera texto sintético para imagen sin contenido', () => {
    const out = extractDemoOcrText({
      title: 'RX torax',
      mimeType: 'image/png',
      textContent: '[OCR pendiente — demo] RX torax',
    });
    expect(out.mode).toBe('synthetic');
    expect(out.text).toContain('RX torax');
  });

  it('reutiliza texto existente', () => {
    const out = extractDemoOcrText({
      title: 'Nota',
      textContent: 'Alergia documentada demo',
    });
    expect(out.mode).toBe('extracted');
    expect(out.text).toBe('Alergia documentada demo');
  });
});
