import { describeIntegration } from '@epis2/test-fixtures';
import { describe, expect, it } from 'vitest';
import { resolveCommand, DASHBOARD_TAB_BY_INTENT } from '@epis2/command-registry';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const DEMO005 = 'a0000001-0000-4000-8000-000000000005';

async function loginAuditor(app: Awaited<ReturnType<typeof buildApp>>) {
  const login = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { username: 'auditor.demo', demoAuthKey: 'DEMO-CLAVE-AUDITOR' },
  });
  expect(login.statusCode).toBe(200);
  return String(login.headers['set-cookie']).split(';')[0];
}

describe('V4 command registry', () => {
  it('tablero calidad resuelve intent quality', () => {
    const r = resolveCommand({ text: 'tablero de calidad', role: 'auditor' });
    expect(r.status).toBe('resolved');
    if (r.status === 'resolved') {
      expect(r.intent).toBe('open_dashboard_quality');
      expect(DASHBOARD_TAB_BY_INTENT.open_dashboard_quality).toBe('quality');
    }
  });
});

describeIntegration('V4 interoperabilidad API (integration)', () => {
  it('auditor accede a quality, staging, ops y audit; médico no a audit', async () => {
    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
    const auditorCookie = await loginAuditor(app);

    const quality = await app.inject({
      method: 'GET',
      url: '/api/dashboard/quality',
      headers: { cookie: auditorCookie },
    });
    expect(quality.statusCode).toBe(200);
    const qBody = quality.json() as {
      readOnly: boolean;
      stagingBatches: { sourceSystem: string }[];
      metrics: { criticalUnacked: number };
    };
    expect(qBody.readOnly).toBe(true);
    expect(qBody.stagingBatches.some((b) => b.sourceSystem === 'HL7v2-ADT')).toBe(true);

    const staging = await app.inject({
      method: 'GET',
      url: '/api/interop/staging',
      headers: { cookie: auditorCookie },
    });
    expect(staging.statusCode).toBe(200);

    const ops = await app.inject({
      method: 'GET',
      url: '/api/ops/status',
      headers: { cookie: auditorCookie },
    });
    expect(ops.statusCode).toBe(200);

    const audit = await app.inject({
      method: 'GET',
      url: '/api/audit/events',
      headers: { cookie: auditorCookie },
    });
    expect(audit.statusCode).toBe(200);

    const medLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const medCookie = String(medLogin.headers['set-cookie']).split(';')[0];
    const medAudit = await app.inject({
      method: 'GET',
      url: '/api/audit/events',
      headers: { cookie: medCookie },
    });
    expect(medAudit.statusCode).toBe(403);

    await app.close();
  });

  it('HL7 validate acepta MSH demo', async () => {
    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
    const cookie = await loginAuditor(app);
    const res = await app.inject({
      method: 'POST',
      url: '/api/interop/hl7/validate',
      headers: { cookie, 'content-type': 'application/json' },
      payload: {
        message: 'MSH|^~\\&|EPIS2|LAB|20260101120000||ADT^A01|1|P|2.5',
      },
    });
    expect(res.statusCode).toBe(200);
    expect((res.json() as { valid: boolean }).valid).toBe(true);
    await app.close();
  });

  it('bundle DEMO-005 incluye AllergyIntolerance penicilina', async () => {
    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];
    const bundle = await app.inject({
      method: 'GET',
      url: `/api/fhir/patients/${DEMO005}/bundle`,
      headers: { cookie },
    });
    expect(bundle.statusCode).toBe(200);
    const entry = (bundle.json() as { entry: { resource: { resourceType: string; code?: unknown } }[] })
      .entry;
    const allergies = entry.filter((e) => e.resource.resourceType === 'AllergyIntolerance');
    expect(allergies.length).toBeGreaterThan(0);
    const penicillin = allergies.some((a) =>
      JSON.stringify(a.resource).toLowerCase().includes('penic'),
    );
    expect(penicillin).toBe(true);
    await app.close();
  });
});
