import { describeIntegration } from '@epis2/test-fixtures/integration';
import { expect, it } from 'vitest';
import { buildApp } from '../../app.js';
import { testApiConfig } from '../../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

describeIntegration('CDS order-select API (MF-CU-03)', () => {
  it('GET /api/cds/order-select/:patientId devuelve cards de prescripción DEMO-005', async () => {
    const app = await buildApp(config);

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
    const demo005 = (
      patients.json() as { patients: { id: string; demoCaseCode?: string }[] }
    ).patients.find((p) => p.demoCaseCode === 'DEMO-005');
    expect(demo005?.id).toBeTruthy();

    const res = await app.inject({
      method: 'GET',
      url: `/api/cds/order-select/${demo005!.id}?blueprintId=prescription&fields=${encodeURIComponent(
        JSON.stringify({ medication: 'Ceftriaxona 1 g IV' }),
      )}`,
      headers: { cookie },
    });
    expect(res.statusCode).toBe(200);

    const body = res.json() as {
      readOnly: boolean;
      cards: { hook: string; ruleId: string; variant: string }[];
    };
    expect(body.readOnly).toBe(true);
    expect(body.cards.length).toBeGreaterThan(0);
    expect(body.cards.every((c) => c.hook === 'order-select')).toBe(true);
    expect(
      body.cards.some(
        (c) =>
          c.ruleId.includes('beta-lactam') ||
          c.ruleId.includes('allergy') ||
          c.ruleId.includes('duplicate'),
      ),
    ).toBe(true);

    await app.close();
  });
});
