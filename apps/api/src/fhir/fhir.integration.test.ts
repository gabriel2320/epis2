import { describeIntegration } from '@epis2/test-fixtures/integration';
import { expect, it } from 'vitest';
import { assertExportClean } from '@epis2/fhir-export';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

describeIntegration('FHIR export API (integration)', () => {
  it('exporta Patient y Bundle validados para caso demo', async () => {
    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const patients = await app.inject({
      method: 'GET',
      url: '/api/patients',
      headers: { cookie },
    });
    const patientId = (patients.json() as { patients: { id: string }[] }).patients[0]?.id;
    expect(patientId).toBeTruthy();

    const patientFhir = await app.inject({
      method: 'GET',
      url: `/api/fhir/Patient/${patientId}`,
      headers: { cookie },
    });
    expect(patientFhir.statusCode).toBe(200);
    expect(patientFhir.headers['content-type']).toContain('application/fhir+json');
    const patientBody = patientFhir.json() as { resourceType: string };
    expect(patientBody.resourceType).toBe('Patient');
    expect(assertExportClean(patientBody).ok).toBe(true);

    const bundle = await app.inject({
      method: 'GET',
      url: `/api/fhir/patients/${patientId}/bundle`,
      headers: { cookie },
    });
    expect(bundle.statusCode).toBe(200);
    const bundleBody = bundle.json() as { resourceType: string; entry: unknown[] };
    expect(bundleBody.resourceType).toBe('Bundle');
    expect(bundleBody.entry.length).toBeGreaterThan(0);
    expect(assertExportClean(bundleBody).ok).toBe(true);

    await app.close();
  });
});
