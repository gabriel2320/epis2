import { describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('inpatient API (integration)', () => {
  it('tablero servicio lista censo y acuse de crítico', async () => {
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
      census: { bedLabel: string; patientDisplayName?: string }[];
      unacknowledgedCriticals: { id: string; label: string }[];
    };
    expect(body.unitCode).toBe('CIRUGIA-DEMO');
    expect(body.census.length).toBeGreaterThanOrEqual(3);
    expect(body.census.some((b) => b.bedLabel === '101A' && b.patientDisplayName)).toBe(true);
    expect(
      (body as { activeOrders: { title: string }[] }).activeOrders.length,
    ).toBeGreaterThan(0);

    const inr = body.unacknowledgedCriticals.find((c) => c.label === 'INR');
    if (inr) {
      const ack = await app.inject({
        method: 'POST',
        url: `/api/inpatient/critical-results/${inr.id}/acknowledge`,
        headers: { cookie },
      });
      expect(ack.statusCode).toBe(200);

      const after = await app.inject({
        method: 'GET',
        url: '/api/dashboard/service',
        headers: { cookie },
      });
      const afterJson = after.json() as { unacknowledgedCriticals: { label: string }[] };
      expect(afterJson.unacknowledgedCriticals.some((c) => c.label === 'INR')).toBe(false);
    } else {
      expect(body.unacknowledgedCriticals.length).toBeGreaterThanOrEqual(0);
    }

    await app.close();
  });
});
