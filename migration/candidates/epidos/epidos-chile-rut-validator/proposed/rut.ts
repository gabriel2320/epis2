/**
 * Adaptación EPIS2 — validador RUT chileno (dominio puro).
 * Destino futuro: packages/clinical-domain o packages/contracts.
 */
export type {
  RutValidationResult,
} from '../original/rut.js';
export {
  cleanRutInput,
  computeRutVerifier,
  formatRut,
  normalizeRut,
  validateRut,
  isValidRut,
  rutMatchesPattern,
} from '../original/rut.js';
