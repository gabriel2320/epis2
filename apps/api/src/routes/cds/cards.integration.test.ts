import { describeIntegration } from '@epis2/test-fixtures/integration';
import { expect, it } from 'vitest';
import { buildApp } from '../../app.js';
import { testApiConfig } from '../../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

describeIntegration('CDS cards API (MF-CU-04)', () => {
  it('GET y POST /api/cds/cards devuelven cards para DEMO-005 (patient-view y order-select)', async () => {
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

    const patientViewGet = await app.inject({
      method: 'GET',
      url: `/api/cds/cards/${demo005!.id}?hook=patient-view`,
      headers: { cookie },
    });
    expect(patientViewGet.statusCode).toBe(200);
    const patientViewBody = patientViewGet.json() as {
      readOnly: boolean;
      hook: string;
      cards: { hook: string; ruleId: string }[];
    };
    expect(patientViewBody.readOnly).toBe(true);
    expect(patientViewBody.hook).toBe('patient-view');
    expect(patientViewBody.cards.length).toBeGreaterThan(0);
    expect(patientViewBody.cards.every((c) => c.hook === 'patient-view')).toBe(true);

    const patientViewPost = await app.inject({
      method: 'POST',
      url: '/api/cds/cards',
      headers: { cookie },
      payload: {
        patientId: demo005!.id,
        hook: 'patient-view',
        prefetch: true,
      },
    });
    expect(patientViewPost.statusCode).toBe(200);
    const patientViewPostBody = patientViewPost.json() as { hook: string; cards: unknown[] };
    expect(patientViewPostBody.hook).toBe('patient-view');
    expect(patientViewPostBody.cards.length).toBeGreaterThan(0);

    const orderSelectGet = await app.inject({
      method: 'GET',
      url: `/api/cds/cards/${demo005!.id}?hook=order-select&blueprintId=prescription&fields=${encodeURIComponent(
        JSON.stringify({ medication: 'Ceftriaxona 1 g IV' }),
      )}`,
      headers: { cookie },
    });
    expect(orderSelectGet.statusCode).toBe(200);
    const orderSelectBody = orderSelectGet.json() as {
      hook: string;
      cards: { hook: string; ruleId: string }[];
    };
    expect(orderSelectBody.hook).toBe('order-select');
    expect(orderSelectBody.cards.length).toBeGreaterThan(0);
    expect(orderSelectBody.cards.every((c) => c.hook === 'order-select')).toBe(true);
    expect(
      orderSelectBody.cards.some(
        (c) =>
          c.ruleId.includes('beta-lactam') ||
          c.ruleId.includes('allergy') ||
          c.ruleId.includes('duplicate'),
      ),
    ).toBe(true);

    const orderSelectPost = await app.inject({
      method: 'POST',
      url: '/api/cds/cards',
      headers: { cookie },
      payload: {
        patientId: demo005!.id,
        hook: 'order-select',
        blueprintId: 'prescription',
        fields: { medication: 'Ceftriaxona 1 g IV' },
        prefetch: true,
      },
    });
    expect(orderSelectPost.statusCode).toBe(200);
    const orderSelectPostBody = orderSelectPost.json() as {
      hook: string;
      cards: { hook: string }[];
    };
    expect(orderSelectPostBody.hook).toBe('order-select');
    expect(orderSelectPostBody.cards.every((c) => c.hook === 'order-select')).toBe(true);

    await app.close();
  });
});
