import { describe, expect, it } from 'vitest';
import { COLLOQUIAL_RULES, matchColloquialRule } from './colloquial-rules.js';
import { normalizeCommandText } from './normalize.js';

/** Cada regla coloquial debe activarse con al menos una frase de muestra. */
const RULE_SAMPLES: Record<string, string> = {
  'ready-to-leave': 'mandarlo a casa',
  'discharge-pending': 'que le falta para irse',
  'review-imaging': 'revisar imagenes',
  'review-antibiotics': 'revisar antibioticos activos',
  'ask-ai': 'preguntarle a la ia',
  'summarize-case': 'como va el paciente',
  'open-chart': 'abrir ficha',
  'print-rx': 'armar la receta',
  'print-cert': 'certificado para el trabajo',
  'check-labs-colloquial': 'echarle un vistazo al lab',
  'write-note-colloquial': 'anotar evolucion',
  'nursing-med-admin': 'aplicar medicamento',
  'referral-colloquial': 'derivar a cardiologia',
  'order-imaging-colloquial': 'pedir una rx',
  'pharmacy-colloquial': 'validar en farmacia',
  'allergy-colloquial': 'registrar alergia',
  'problem-colloquial': 'impresion diagnostica',
};

describe('colloquial rules (MF-CM-07)', () => {
  it('cada regla tiene muestra que la activa', () => {
    for (const rule of COLLOQUIAL_RULES) {
      const sample = RULE_SAMPLES[rule.id];
      expect(sample, `falta muestra para ${rule.id}`).toBeTruthy();
      const normalized = normalizeCommandText(sample!);
      expect(rule.matches(normalized), rule.id).toBe(true);
      expect(matchColloquialRule(normalized)?.id).toBe(rule.id);
    }
  });

  it('hay al menos 15 reglas coloquiales', () => {
    expect(COLLOQUIAL_RULES.length).toBeGreaterThanOrEqual(15);
  });
});
