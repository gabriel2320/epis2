import { describe, expect, it } from 'vitest';
import {
  CLINICAL_CONTEXT_DRAG_MIME,
  parseClinicalContextDrag,
  serializeClinicalContextDrag,
} from './clinical-context-dnd.js';

describe('clinical-context-dnd', () => {
  it('serializa y parsea payload de arrastre', () => {
    const payload = { text: 'Evolución (10-05-2026): Meropenem', sourceEventId: 'ev-1' };
    const raw = serializeClinicalContextDrag(payload);
    expect(parseClinicalContextDrag(raw)).toEqual(payload);
  });

  it('rechaza payload inválido', () => {
    expect(parseClinicalContextDrag('')).toBeNull();
    expect(parseClinicalContextDrag('{"text":""}')).toBeNull();
    expect(parseClinicalContextDrag('not-json')).toBeNull();
  });

  it('expone MIME clínico', () => {
    expect(CLINICAL_CONTEXT_DRAG_MIME).toBe('application/x-epis2-clinical-context');
  });
});
