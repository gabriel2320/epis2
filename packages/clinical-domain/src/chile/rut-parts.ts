import { validateRut } from './rut.js';

export type RutParts = {
  rutNumero: number;
  rutDv: string;
  normalized: string;
};

/** Descompone RUT válido en número, DV y forma normalizada (MF-CHILE-ID-01). */
export function parseRutParts(input: string): RutParts | null {
  const result = validateRut(input);
  if (!result.valid || !result.body || !result.verifier || !result.normalized) {
    return null;
  }
  return {
    rutNumero: Number(result.body),
    rutDv: result.verifier,
    normalized: result.normalized,
  };
}
