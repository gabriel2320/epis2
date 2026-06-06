import { describeIntegration } from '@epis2/test-fixtures/integration';
import { expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const ORU_DEMO = [
  'MSH|^~\\&|LAB|HOSP|EPIS2|20260101120000||ORU^R01|1|P|2.5',
  'PID|1||a0000001-0000-4000-8000-000000000004||Vega^Roberto',
  'OBR|1|||CBC^Hemograma control',
  'OBX|1|NM|WBC^Leucocitos||9.2|10*3/uL',
].join('\r');

async function loginAuditor(app: Awaited<ReturnType<typeof buildApp>>) {
  const login = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { username: 'auditor.demo', demoAuthKey: 'DEMO-CLAVE-AUDITOR' },
  });
  return String(login.headers['set-cookie']).split(';')[0];
}

describeIntegration('HL7 cuarentena MF-180…182', () => {
  it('cuarentena → mapeo → borrador propuesto → revertir sin SoT', async () => {
    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
    const cookie = await loginAuditor(app);

    const intake = await app.inject({
      method: 'POST',
      url: '/api/interop/hl7/quarantine',
      headers: { cookie, 'content-type': 'application/json' },
      payload: { message: ORU_DEMO },
    });
    expect(intake.statusCode).toBe(200);
    const { quarantineId } = intake.json() as { quarantineId: string };

    const mapping = await app.inject({
      method: 'GET',
      url: `/api/interop/hl7/quarantine/${quarantineId}/mapping`,
      headers: { cookie },
    });
    expect(mapping.statusCode).toBe(200);
    expect((mapping.json() as { suggestedDraftType: string }).suggestedDraftType).toBe(
      'lab_request',
    );

    const propose = await app.inject({
      method: 'POST',
      url: `/api/interop/hl7/quarantine/${quarantineId}/propose-writeback`,
      headers: { cookie },
    });
    expect(propose.statusCode).toBe(200);
    const body = propose.json() as {
      requiresHumanApproval: boolean;
      draft: { status: string; id: string };
    };
    expect(body.requiresHumanApproval).toBe(true);
    expect(body.draft.status).toBe('draft');

    const revert = await app.inject({
      method: 'POST',
      url: `/api/interop/hl7/quarantine/${quarantineId}/revert`,
      headers: { cookie },
    });
    expect(revert.statusCode).toBe(200);

    await app.close();
  });
});
