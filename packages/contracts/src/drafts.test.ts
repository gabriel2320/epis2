import { describe, expect, it } from 'vitest';
import { draftsListQuerySchema } from './drafts.js';

describe('draftsListQuerySchema', () => {
  it('aplica defaults limit=50 offset=0', () => {
    const parsed = draftsListQuerySchema.parse({});
    expect(parsed.limit).toBe(50);
    expect(parsed.offset).toBe(0);
  });

  it('coerciona strings de query y acepta máximo 100', () => {
    const parsed = draftsListQuerySchema.parse({ limit: '100', offset: '25' });
    expect(parsed.limit).toBe(100);
    expect(parsed.offset).toBe(25);
  });

  it('rechaza limit fuera de rango y offset negativo', () => {
    expect(() => draftsListQuerySchema.parse({ limit: '0' })).toThrow();
    expect(() => draftsListQuerySchema.parse({ limit: '500' })).toThrow();
    expect(() => draftsListQuerySchema.parse({ offset: '-1' })).toThrow();
  });

  it('rechaza patientId no uuid', () => {
    expect(() => draftsListQuerySchema.parse({ patientId: 'abc' })).toThrow();
  });
});
