/** Ruta canónica — documentar aquí cualquier cambio de contrato DATABASE_URL. */
export const INTEGRATION_DATABASE_DOC = 'docs/quality/INTEGRATION_DATABASE.md';

export const INTEGRATION_SKIP_REASON =
  'omitido: sin DATABASE_URL — ver docs/quality/INTEGRATION_DATABASE.md';

/** Suites que requieren Postgres migrado (paridad con CI). */
export const INTEGRATION_TEST_SUITES = [
  'apps/api/src/clinical/clinical.integration.test.ts',
  'apps/api/src/clinical/admission.integration.test.ts',
  'apps/api/src/clinical/search.integration.test.ts',
  'apps/api/src/clinical/v3-mar.integration.test.ts',
  'apps/api/src/dashboard/dashboard.test.ts',
  'apps/api/src/db/rls.integration.test.ts',
  'apps/api/src/fhir/fhir.integration.test.ts',
  'apps/api/src/inpatient/inpatient.integration.test.ts',
  'apps/api/src/v4/v4.integration.test.ts',
  'apps/api/src/v5/v5.integration.test.ts',
  'tests/golden-clinical-journey.api.spec.ts',
] as const;

export function hasIntegrationDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
