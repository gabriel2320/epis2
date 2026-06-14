import { describeIntegration } from '@epis2/test-fixtures/integration';
import { expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

describeIntegration('user operational memory API (MF-DI-02)', () => {
  it('persiste sección tradicional y pacientes recientes por usuario', async () => {
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
    const patientId = (patients.json() as { patients: { id: string }[] }).patients[0]?.id;
    if (!patientId) throw new Error('Sin pacientes demo');

    const touch = await app.inject({
      method: 'POST',
      url: '/api/user/operational-memory/recent-patients',
      headers: { cookie },
      payload: { id: patientId, displayName: 'Paciente demo touch' },
    });
    expect(touch.statusCode).toBe(200);

    const patch = await app.inject({
      method: 'PATCH',
      url: `/api/user/operational-memory?patientId=${patientId}`,
      headers: { cookie },
      payload: { traditionalSection: 'navMeds' },
    });
    expect(patch.statusCode).toBe(200);
    const patchJson = patch.json() as {
      patient: { traditionalSection?: string } | null;
      global: { recentPatients: { id: string }[] };
    };
    expect(patchJson.patient?.traditionalSection).toBe('navMeds');
    expect(patchJson.global.recentPatients.some((p) => p.id === patientId)).toBe(true);

    const read = await app.inject({
      method: 'GET',
      url: `/api/user/operational-memory?patientId=${patientId}`,
      headers: { cookie },
    });
    expect(read.statusCode).toBe(200);
    const readJson = read.json() as { patient: { traditionalSection?: string } | null };
    expect(readJson.patient?.traditionalSection).toBe('navMeds');
  });
});
