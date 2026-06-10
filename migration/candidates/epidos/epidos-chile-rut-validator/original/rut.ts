/**
 * Validación y normalización de RUT/RUN chileno.
 * Algoritmo módulo 11 con dígito verificador 0-9 o K.
 */

const RUT_BODY_PATTERN = /^(\d{1,2}\.?\d{3}\.?\d{3}|\d{7,8})-?([\dkK])$/;
const RUT_CLEAN_PATTERN = /[^0-9kK]/g;

export interface RutValidationResult {
  valid: boolean;
  normalized: string | null;
  body: string | null;
  verifier: string | null;
  error?: string;
}

export function cleanRutInput(input: string): string {
  return input.trim().replace(RUT_CLEAN_PATTERN, '').toUpperCase();
}

export function computeRutVerifier(body: string): string {
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return '0';
  if (remainder === 10) return 'K';
  return String(remainder);
}

export function formatRut(body: string, verifier: string): string {
  const padded = body.padStart(8, '0');
  const millions = padded.slice(0, -6).replace(/^0+(?=\d)/, '') || '0';
  const thousands = padded.slice(-6, -3);
  const units = padded.slice(-3);
  return `${millions}.${thousands}.${units}-${verifier}`;
}

export function normalizeRut(input: string): string | null {
  const result = validateRut(input);
  return result.valid ? result.normalized : null;
}

export function validateRut(input: string): RutValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, normalized: null, body: null, verifier: null, error: 'RUT vacío' };
  }

  const cleaned = cleanRutInput(trimmed);
  if (cleaned.length < 2) {
    return {
      valid: false,
      normalized: null,
      body: null,
      verifier: null,
      error: 'RUT demasiado corto',
    };
  }

  const verifier = cleaned.slice(-1);
  const body = cleaned.slice(0, -1).replace(/^0+/, '') || '0';

  if (!/^\d+$/.test(body)) {
    return {
      valid: false,
      normalized: null,
      body: null,
      verifier: null,
      error: 'Cuerpo RUT inválido',
    };
  }

  if (body.length < 7 || body.length > 8) {
    return {
      valid: false,
      normalized: null,
      body: null,
      verifier: null,
      error: 'RUT debe tener 7-8 dígitos',
    };
  }

  const expected = computeRutVerifier(body);
  if (expected !== verifier) {
    return {
      valid: false,
      normalized: null,
      body,
      verifier,
      error: `Dígito verificador inválido (esperado ${expected})`,
    };
  }

  const normalized = formatRut(body, verifier);
  return { valid: true, normalized, body, verifier };
}

export function isValidRut(input: string): boolean {
  return validateRut(input).valid;
}

export function rutMatchesPattern(input: string): boolean {
  return RUT_BODY_PATTERN.test(input.trim());
}
