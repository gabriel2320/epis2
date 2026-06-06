import { DEMO_CLINICAL_CASES } from '@epis2/test-fixtures';
import { describeIntegration } from '@epis2/test-fixtures/integration';
import { expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

const DEMO004_ADMISSION = 'f0000003-0000-4000-8000-000000000001';
const BED_102A = 'f0000002-0000-4000-8000-000000000003';
const BED_101A = 'f0000002-0000-4000-8000-000000000001';

describeIntegration('inpatient API (integration)', () => {
  it('tablero servicio, traslado, ingreso, alta y comando ingreso', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const service = await app.inject({
      method: 'GET',
      url: '/api/dashboard/service',
      headers: { cookie },
    });
    expect(service.statusCode).toBe(200);
    const body = service.json() as {
      unitCode: string;
      census: { bedLabel: string; admissionId?: string; patientDisplayName?: string }[];
      unacknowledgedCriticals: { id: string; label: string }[];
      activeOrders: { title: string }[];
    };
    expect(body.unitCode).toBe('CIRUGIA-DEMO');
    expect(body.census.some((b) => b.bedLabel === '101A' && b.patientDisplayName)).toBe(true);
    expect(body.activeOrders.length).toBeGreaterThan(0);

    const transfer = await app.inject({
      method: 'POST',
      url: `/api/inpatient/admissions/${DEMO004_ADMISSION}/transfer`,
      headers: { cookie },
      payload: { targetBedId: BED_102A },
    });
    expect(transfer.statusCode).toBe(200);
    expect((transfer.json() as { toBedLabel: string }).toBedLabel).toBe('102A');

    const demo001 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-001')!;
    const admit = await app.inject({
      method: 'POST',
      url: '/api/inpatient/admissions',
      headers: { cookie },
      payload: { patientId: demo001.patientId, bedId: BED_101A },
    });
    expect(admit.statusCode).toBe(201);
    const admitJson = admit.json() as {
      admission: { id: string; bedLabel: string };
      requiresHumanReview: boolean;
    };
    expect(admitJson.requiresHumanReview).toBe(true);
    expect(admitJson.admission.bedLabel).toBe('101A');

    const discharge = await app.inject({
      method: 'POST',
      url: `/api/inpatient/admissions/${admitJson.admission.id}/discharge`,
      headers: { cookie },
    });
    expect(discharge.statusCode).toBe(200);
    const dischargeJson = discharge.json() as { epicrisisRoute: string };
    expect(dischargeJson.epicrisisRoute).toBe('/espacio/epicrisis');

    const cmd = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: {
        text: 'ingreso hospitalario',
        patientId: DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-003')!.patientId,
      },
    });
    expect(cmd.statusCode).toBe(200);
    expect((cmd.json() as { status: string; routePath?: string }).status).toBe('resolved');

    const inr = body.unacknowledgedCriticals.find((c) => c.label === 'INR');
    if (inr) {
      const ack = await app.inject({
        method: 'POST',
        url: `/api/inpatient/critical-results/${inr.id}/acknowledge`,
        headers: { cookie },
      });
      expect(ack.statusCode).toBe(200);
    }

    const pdfExport = await app.inject({
      method: 'GET',
      url: `/api/patients/${demo001.patientId}/export/summary?format=pdf`,
      headers: { cookie },
    });
    expect(pdfExport.statusCode).toBe(200);
    expect(String(pdfExport.headers['content-type'])).toContain('application/pdf');
    expect(pdfExport.rawPayload.toString('utf8').startsWith('%PDF')).toBe(true);

    await app.close();
  });
});
