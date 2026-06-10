import { describe, expect, it } from 'vitest';
import { decodeBody } from './http.js';

describe('drug-intel http decodeBody', () => {
  it('decodifica UTF-8 válido', () => {
    const buffer = new TextEncoder().encode('LOSARTÁN POTÁSICO Ñuñoa').buffer as ArrayBuffer;
    expect(decodeBody(buffer)).toBe('LOSARTÁN POTÁSICO Ñuñoa');
  });

  it('reintenta como windows-1252 cuando UTF-8 trae reemplazos', () => {
    // 'UNGÜENTO TÓPICO' en windows-1252: Ü=0xDC, Ó=0xD3.
    const bytes = new Uint8Array([
      0x55, 0x4e, 0x47, 0xdc, 0x45, 0x4e, 0x54, 0x4f, 0x20, 0x54, 0xd3, 0x50, 0x49, 0x43, 0x4f,
    ]);
    expect(decodeBody(bytes.buffer as ArrayBuffer)).toBe('UNGÜENTO TÓPICO');
  });
});
