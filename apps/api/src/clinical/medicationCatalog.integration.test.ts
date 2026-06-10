/**
 * MF-184: catálogo de medicamentos consultable por roles clínicos
 * (`GET /api/clinical/catalogs/medication`) para autocomplete de receta/MAR.
 * Lee solo entradas activas promovidas a `clinical_catalog_staging`.
 */
import postgres from 'postgres';
import { describeIntegration } from '@epis2/test-fixtures/integration';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

const suffix = Date.now();
const entryActive = `mf184-test-${suffix}-a`;
const entryRetired = `mf184-test-${suffix}-b`;

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

describeIntegration('clinical medication catalog (integration)', () => {
  let sql: ReturnType<typeof postgres>;

  beforeAll(async () => {
    sql = postgres(process.env.DATABASE_URL!, { max: 1 });
    await sql`
      INSERT INTO clinical_catalog_staging (catalog_code, entry_code, label, status, created_by)
      VALUES
        ('medication', ${entryActive}, ${`Losartán MF184 ${suffix} 50 mg comprimidos`}, 'active', 'usr-physician-01'),
        ('medication', ${entryRetired}, ${`Losartán MF184 ${suffix} inactivo`}, 'inactive', 'usr-physician-01')
      ON CONFLICT (catalog_code, entry_code) DO NOTHING
    `;
  });

  afterAll(async () => {
    await sql`
      DELETE FROM clinical_catalog_staging
      WHERE catalog_code = 'medication' AND entry_code IN (${entryActive}, ${entryRetired})
    `;
    await sql.end();
  });

  it('médico busca por texto y solo recibe entradas activas; sin sesión 401', async () => {
    const app = await buildApp(config);
    const physicianCookie = await loginCookie(app, 'medico.demo', 'DEMO-CLAVE-MEDICO');

    const ok = await app.inject({
      method: 'GET',
      url: `/api/clinical/catalogs/medication?q=${encodeURIComponent(`MF184 ${suffix}`)}`,
      headers: { cookie: physicianCookie },
    });
    expect(ok.statusCode).toBe(200);
    const body = ok.json() as {
      readOnly: boolean;
      catalogCode: string;
      entries: Array<{ entryCode: string; label: string }>;
    };
    expect(body.readOnly).toBe(true);
    expect(body.catalogCode).toBe('medication');
    expect(body.entries.some((e) => e.entryCode === entryActive)).toBe(true);
    expect(body.entries.some((e) => e.entryCode === entryRetired)).toBe(false);

    const anonymous = await app.inject({
      method: 'GET',
      url: '/api/clinical/catalogs/medication?q=losartan',
    });
    expect(anonymous.statusCode).toBe(401);

    await app.close();
  });

  it('enfermería también puede consultar (patient.read) y limit se acota', async () => {
    const app = await buildApp(config);
    const nurseCookie = await loginCookie(app, 'enfermeria.demo', 'DEMO-CLAVE-ENFERMERIA');

    const ok = await app.inject({
      method: 'GET',
      url: `/api/clinical/catalogs/medication?q=${encodeURIComponent(`MF184 ${suffix}`)}&limit=9999`,
      headers: { cookie: nurseCookie },
    });
    expect(ok.statusCode).toBe(200);
    const body = ok.json() as { entries: Array<{ entryCode: string }> };
    expect(body.entries.length).toBeLessThanOrEqual(50);
    expect(body.entries.some((e) => e.entryCode === entryActive)).toBe(true);

    await app.close();
  });
});
