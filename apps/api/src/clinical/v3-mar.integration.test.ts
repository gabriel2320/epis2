import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { getDatabase } from '../db/client.js';
import { marAdministrationRecords } from '../db/schema.js';
import { testApiConfig } from '../testConfig.js';

const hasDb = Boolean(process.env.DATABASE_URL);
const DEMO005 = 'a0000001-0000-4000-8000-000000000005';

describe.skipIf(!hasDb)('V3 MAR (integration)', () => {
  it('aprobar borrador MAR crea mar_administration_records', async () => {
    const config = { ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL };
    const app = await buildApp(config);
    const db = getDatabase(config.DATABASE_URL)!;

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const created = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie },
      payload: {
        patientId: DEMO005,
        encounterId: 'b0000001-0000-4000-8000-000000000005',
        draftType: 'medication_administration',
        title: 'MAR Warfarina test',
        body: {
          medication: 'Warfarina',
          dose: '5 mg',
          route: 'VO',
          doubleCheckConfirmed: true,
        },
      },
    });
    expect(created.statusCode).toBe(201);
    const draftId = (created.json() as { draft: { id: string } }).draft.id;

    const approved = await app.inject({
      method: 'POST',
      url: `/api/drafts/${draftId}/approve`,
      headers: { cookie },
    });
    expect(approved.statusCode).toBe(200);

    const rows = await db
      .select()
      .from(marAdministrationRecords)
      .where(eq(marAdministrationRecords.draftId, draftId));
    expect(rows.length).toBe(1);
    expect(rows[0]?.medication).toMatch(/warfarina/i);
    expect(rows[0]?.doubleCheck).toBe(true);

    await app.close();
  });
});
