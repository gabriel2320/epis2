import { describe, expect, it } from 'vitest';
import { createTextOrigin } from '../safety/textOrigin.js';
import { EPIS2_DRAFT_TEXTBOX_META_KEY, EPIS2_DRAFT_TEXT_ORIGINS_KEY } from './draftTextOrigins.js';
import { validateDraftBodyEpis2Meta } from './draftBodyMetaSchema.js';

describe('validateDraftBodyEpis2Meta', () => {
  it('acepta body sin meta _epis2', () => {
    const result = validateDraftBodyEpis2Meta({ subjective: 'Nota' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.body.subjective).toBe('Nota');
    }
  });

  it('normaliza meta completa y sincroniza origins', () => {
    const origin = createTextOrigin('paste', 'Portapapeles');
    const result = validateDraftBodyEpis2Meta({
      objective: 'Texto',
      [EPIS2_DRAFT_TEXTBOX_META_KEY]: {
        objective: { origin, aiSuggestion: false },
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      const origins = result.body[EPIS2_DRAFT_TEXT_ORIGINS_KEY] as Record<string, unknown>;
      expect(origins.objective).toEqual(origin);
    }
  });

  it('rechaza claves _epis2 desconocidas', () => {
    const result = validateDraftBodyEpis2Meta({ _epis2Hack: { x: 1 } });
    expect(result.success).toBe(false);
  });

  it('rechaza origins y meta inconsistentes', () => {
    const originA = createTextOrigin('paste', 'A');
    const originB = createTextOrigin('manual', 'B');
    const result = validateDraftBodyEpis2Meta({
      [EPIS2_DRAFT_TEXT_ORIGINS_KEY]: { field: originA },
      [EPIS2_DRAFT_TEXTBOX_META_KEY]: { field: { origin: originB } },
    });
    expect(result.success).toBe(false);
  });

  it('acepta borrador legacy solo con _epis2TextOrigins', () => {
    const origin = createTextOrigin('snippet', '.soap');
    const result = validateDraftBodyEpis2Meta({
      plan: 'x',
      [EPIS2_DRAFT_TEXT_ORIGINS_KEY]: { plan: origin },
    });
    expect(result.success).toBe(true);
  });
});
