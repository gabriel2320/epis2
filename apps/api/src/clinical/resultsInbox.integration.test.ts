import { DEMO_CLINICAL_CASES } from '@epis2/test-fixtures';
import { describeIntegration } from '@epis2/test-fixtures/integration';
import { patientResultsInboxResponseSchema } from '@epis2/contracts';
import { eq } from 'drizzle-orm';
import { expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { getDatabase } from '../db/client.js';
import { clinicalCriticalResults } from '../db/schema.js';
import { testApiConfig } from '../testConfig.js';

const DEMO004_PCR_CRITICAL_ID = 'f0000004-0000-4000-8000-000000000002';

describeIntegration('bandeja resultados (MF-161)', () => {
  it('agrega observaciones, críticos y órdenes pendientes por paciente', async () => {
    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const demo001 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-001')!;
    const res001 = await app.inject({
      method: 'GET',
      url: `/api/patients/${demo001.patientId}/results-inbox`,
      headers: { cookie },
    });
    expect(res001.statusCode).toBe(200);
    const inbox001 = patientResultsInboxResponseSchema.parse(res001.json());
    expect(inbox001.readOnly).toBe(true);
    expect(inbox001.demoCaseCode).toBe('DEMO-001');
    expect(inbox001.observations.some((o) => o.label === 'Creatinina')).toBe(true);
    expect(inbox001.criticalResults).toHaveLength(0);

    const demo005 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-005')!;
    const res005 = await app.inject({
      method: 'GET',
      url: `/api/patients/${demo005.patientId}/results-inbox`,
      headers: { cookie },
    });
    expect(res005.statusCode).toBe(200);
    const inbox005 = patientResultsInboxResponseSchema.parse(res005.json());
    expect(inbox005.observations.some((o) => o.label === 'INR')).toBe(true);
    expect(inbox005.criticalResults.some((c) => c.label === 'INR')).toBe(true);

    const demo004 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-004')!;
    const res004 = await app.inject({
      method: 'GET',
      url: `/api/patients/${demo004.patientId}/results-inbox`,
      headers: { cookie },
    });
    const inbox004 = patientResultsInboxResponseSchema.parse(res004.json());
    expect(inbox004.observations.length).toBeGreaterThan(0);

    await app.close();
  });

  it('vincula orden y resultado en bandeja (MF-163)', async () => {
    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const demo004 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-004')!;
    const res = await app.inject({
      method: 'GET',
      url: `/api/patients/${demo004.patientId}/results-inbox`,
      headers: { cookie },
    });
    const inbox = patientResultsInboxResponseSchema.parse(res.json());
    const leucocitos = inbox.observations.find((o) => o.label === 'Leucocitos');
    expect(leucocitos?.orderTitle).toBe('Hemograma control mañana');
    expect(inbox.pendingOrders.some((o) => o.title === 'Hemograma control mañana')).toBe(false);

    const pcrCritical = inbox.criticalResults.find((c) => c.label === 'PCR');
    expect(pcrCritical?.orderTitle).toBe('Hemograma control mañana');

    await app.close();
  });

  it('acuse de crítico desde bandeja deja auditoría (MF-162)', async () => {
    const db = getDatabase(process.env.DATABASE_URL!);
    if (!db) throw new Error('DATABASE_URL requerida');
    await db
      .update(clinicalCriticalResults)
      .set({ acknowledgedAt: null, acknowledgedBy: null })
      .where(eq(clinicalCriticalResults.id, DEMO004_PCR_CRITICAL_ID));

    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const demo004 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-004')!;
    const before = await app.inject({
      method: 'GET',
      url: `/api/patients/${demo004.patientId}/results-inbox`,
      headers: { cookie },
    });
    const inboxBefore = patientResultsInboxResponseSchema.parse(before.json());
    const pcr = inboxBefore.criticalResults.find((c) => c.id === DEMO004_PCR_CRITICAL_ID);
    expect(pcr?.acknowledged).toBe(false);

    const ack = await app.inject({
      method: 'POST',
      url: `/api/inpatient/critical-results/${pcr!.id}/acknowledge`,
      headers: { cookie },
    });
    expect(ack.statusCode).toBe(200);

    const after = await app.inject({
      method: 'GET',
      url: `/api/patients/${demo004.patientId}/results-inbox`,
      headers: { cookie },
    });
    const inboxAfter = patientResultsInboxResponseSchema.parse(after.json());
    expect(
      inboxAfter.criticalResults.find((c) => c.id === pcr!.id)?.acknowledged,
    ).toBe(true);

    const auditorLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'auditor.demo', demoAuthKey: 'DEMO-CLAVE-AUDITOR' },
    });
    const auditorCookie = String(auditorLogin.headers['set-cookie']).split(';')[0];
    const audit = await app.inject({
      method: 'GET',
      url: '/api/audit/events',
      headers: { cookie: auditorCookie },
    });
    expect(audit.statusCode).toBe(200);
    const events = (audit.json() as { events: { eventType: string; entityId?: string }[] })
      .events;
    expect(
      events.some((e) => e.eventType === 'critical.acknowledged' && e.entityId === pcr!.id),
    ).toBe(true);

    await app.close();
  });
});
