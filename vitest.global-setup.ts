import { loadEnvFile } from './scripts/load-env.mjs';

export default function globalSetup() {
  loadEnvFile();

  if (!process.env.DATABASE_URL?.trim()) {
    console.warn(
      '[EPIS2] DATABASE_URL no definida: ~20 tests de integración se omiten con mensaje explícito. ' +
        'Paridad CI: docs/quality/INTEGRATION_DATABASE.md',
    );
  }
}
