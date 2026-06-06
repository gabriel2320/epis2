import { describe as vitestDescribe } from 'vitest';
import { INTEGRATION_SKIP_REASON, hasIntegrationDatabase } from './integrationDatabase.js';

/**
 * describe() con skip explícito (no silencioso) cuando falta DATABASE_URL.
 * Solo para tests — no importar desde código de aplicación.
 */
export function describeIntegration(title: string, factory: () => void): void {
  if (hasIntegrationDatabase()) {
    vitestDescribe(title, factory);
    return;
  }
  vitestDescribe.skip(`${title} [${INTEGRATION_SKIP_REASON}]`, factory);
}
