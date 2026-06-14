import { loadEnvFile } from './scripts/load-env.mjs';

export default async function globalSetup() {
  loadEnvFile();

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.warn(
      '[EPIS2] DATABASE_URL no definida: ~20 tests de integración se omiten con mensaje explícito. ' +
        'Paridad CI: docs/quality/INTEGRATION_DATABASE.md',
    );
    return;
  }

  try {
    const { refreshMarDemoWindows } = await import('./apps/api/src/inpatient/integrationReset.js');
    await refreshMarDemoWindows(databaseUrl);
  } catch (err) {
    console.warn('[EPIS2] refreshMarDemoWindows omitido (¿Postgres arriba?):', err);
  }
}
