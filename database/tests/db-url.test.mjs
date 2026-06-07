import { describe, expect, it } from 'vitest';
import { maskDatabaseUrl, resolveMigrateDatabaseUrl } from '../../scripts/db-url.mjs';

describe('db-url', () => {
  it('deriva superuser epis2 desde DATABASE_URL epis2_app', () => {
    const url = resolveMigrateDatabaseUrl({
      DATABASE_URL: 'postgresql://epis2_app:epis2@127.0.0.1:5433/epis2',
    });
    expect(url).toBe('postgresql://epis2:epis2@127.0.0.1:5433/epis2');
  });

  it('respeta DATABASE_MIGRATE_URL explícita', () => {
    const url = resolveMigrateDatabaseUrl({
      DATABASE_URL: 'postgresql://epis2_app:epis2@127.0.0.1:5433/epis2',
      DATABASE_MIGRATE_URL: 'postgresql://epis2:secret@127.0.0.1:5433/epis2',
    });
    expect(url).toBe('postgresql://epis2:secret@127.0.0.1:5433/epis2');
  });

  it('enmascara contraseña en logs', () => {
    expect(maskDatabaseUrl('postgresql://epis2:epis2@127.0.0.1:5433/epis2')).toBe(
      'postgresql://epis2:***@127.0.0.1:5433/epis2',
    );
  });
});
