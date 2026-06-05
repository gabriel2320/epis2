import { describe, expect, it } from 'vitest';
import { pickChipSampleEs } from './chip-samples.js';

describe('pickChipSampleEs', () => {
  it('prefiere frases completas con preparar o solicitar', () => {
    expect(
      pickChipSampleEs(['prepara receta', 'preparar receta médica', 'receta'], 'Receta médica'),
    ).toBe('preparar receta médica');
    expect(
      pickChipSampleEs(['solicita laboratorio', 'solicitar laboratorio'], 'Solicitud de laboratorio'),
    ).toBe('solicitar laboratorio');
  });
});
