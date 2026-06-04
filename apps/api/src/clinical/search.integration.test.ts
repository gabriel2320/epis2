import { describe, expect, it } from 'vitest';
import { DEMO_CLINICAL_CASES } from '@epis2/test-fixtures';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('searchPatients (integration)', () => {
  it('encuentra paciente por código DEMO y por RUT sintético', async () => {
    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const byDemo = await app.inject({
      method: 'GET',
      url: '/api/patients?q=DEMO-001',
      headers: { cookie },
    });
    expect(byDemo.statusCode).toBe(200);
    const demoPatients = (byDemo.json() as { patients: { id: string }[] }).patients;
    expect(demoPatients.some((p) => p.id === DEMO_CLINICAL_CASES[0]!.patientId)).toBe(true);

    const byRut = await app.inject({
      method: 'GET',
      url: '/api/patients?q=12.345.678-5',
      headers: { cookie },
    });
    expect(byRut.statusCode).toBe(200);
    const rutPatients = (byRut.json() as { patients: { id: string }[] }).patients;
    expect(rutPatients.some((p) => p.id === DEMO_CLINICAL_CASES[0]!.patientId)).toBe(true);

    await app.close();
  });
});
