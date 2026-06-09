/**
 * Rutas admin (gap auditoría 4.4): usuarios, catálogos staging y RBAC explícito.
 */
import { describeIntegration } from '@epis2/test-fixtures/integration';
import { expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

async function loginCookie(
  app: Awaited<ReturnType<typeof buildApp>>,
  username: string,
  demoAuthKey: string,
) {
  const login = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { username, demoAuthKey },
  });
  expect(login.statusCode).toBe(200);
  return String(login.headers['set-cookie']).split(';')[0]!;
}

describeIntegration('admin routes (integration)', () => {
  it('GET /api/admin/users — admin lista usuarios; médico recibe 403', async () => {
    const app = await buildApp(config);
    const adminCookie = await loginCookie(app, 'admin.demo', 'DEMO-CLAVE-ADMIN');
    const physicianCookie = await loginCookie(app, 'medico.demo', 'DEMO-CLAVE-MEDICO');

    const ok = await app.inject({
      method: 'GET',
      url: '/api/admin/users',
      headers: { cookie: adminCookie },
    });
    expect(ok.statusCode).toBe(200);
    const users = (ok.json() as { users: { username: string; role: string }[] }).users;
    expect(users.length).toBeGreaterThan(0);
    expect(users.some((u) => u.username === 'admin.demo')).toBe(true);

    const forbidden = await app.inject({
      method: 'GET',
      url: '/api/admin/users',
      headers: { cookie: physicianCookie },
    });
    expect(forbidden.statusCode).toBe(403);

    await app.close();
  });

  it('POST /api/admin/catalogs — solo admin escribe staging (admin.catalogs.write)', async () => {
    const app = await buildApp(config);
    const adminCookie = await loginCookie(app, 'admin.demo', 'DEMO-CLAVE-ADMIN');
    const auditorCookie = await loginCookie(app, 'auditor.demo', 'DEMO-CLAVE-AUDITOR');

    const entryCode = `test_${Date.now()}`;
    const created = await app.inject({
      method: 'POST',
      url: '/api/admin/catalogs',
      headers: { cookie: adminCookie },
      payload: { catalogCode: 'problem_type', entryCode, label: 'Entrada test auditoría' },
    });
    expect(created.statusCode).toBe(201);
    const entry = (created.json() as { entry: { entryCode: string; status: string } }).entry;
    expect(entry.entryCode).toBe(entryCode);

    // Auditor lee catálogos (audit.read) pero no escribe.
    const listed = await app.inject({
      method: 'GET',
      url: '/api/admin/catalogs?catalogCode=problem_type',
      headers: { cookie: auditorCookie },
    });
    expect(listed.statusCode).toBe(200);
    const entries = (listed.json() as { entries: { entryCode: string }[] }).entries;
    expect(entries.some((e) => e.entryCode === entryCode)).toBe(true);

    const forbidden = await app.inject({
      method: 'POST',
      url: '/api/admin/catalogs',
      headers: { cookie: auditorCookie },
      payload: { catalogCode: 'problem_type', entryCode: `${entryCode}_b`, label: 'No permitido' },
    });
    expect(forbidden.statusCode).toBe(403);

    const invalid = await app.inject({
      method: 'POST',
      url: '/api/admin/catalogs',
      headers: { cookie: adminCookie },
      payload: { catalogCode: '', entryCode: '', label: '' },
    });
    expect(invalid.statusCode).toBe(400);

    await app.close();
  });
});
