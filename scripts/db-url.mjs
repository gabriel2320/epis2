/**
 * Resolución de URLs Postgres — migraciones con superuser, API con epis2_app.
 */

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string | undefined}
 */
export function resolveMigrateDatabaseUrl(env = process.env) {
  if (env.DATABASE_MIGRATE_URL) {
    return env.DATABASE_MIGRATE_URL;
  }

  const url = env.DATABASE_URL;
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    if (parsed.username === 'epis2_app') {
      parsed.username = 'epis2';
      return parsed.toString();
    }
    return url;
  } catch {
    if (url.includes('epis2_app@')) {
      return url.replace('epis2_app', 'epis2');
    }
    return url;
  }
}

/**
 * @param {string} url
 */
export function maskDatabaseUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.password) parsed.password = '***';
    return parsed.toString();
  } catch {
    return url.replace(/:([^:@/]+)@/, ':***@');
  }
}
