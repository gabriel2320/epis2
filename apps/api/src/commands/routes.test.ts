import { describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const config = testApiConfig;

describe('POST /api/commands/resolve', () => {
  it('resuelve buscar paciente para médico demo', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const res = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: { text: 'buscar paciente' },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { status: string; routePath?: string };
    expect(body.status).toBe('resolved');
    expect(body.routePath).toBe('/espacio/buscar-paciente');
    await app.close();
  });

  it('auditor recibe 403 al ejecutar comando', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'auditor.demo', demoAuthKey: 'DEMO-CLAVE-AUDITOR' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const res = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: { text: 'buscar paciente' },
    });
    expect(res.statusCode).toBe(403);
    await app.close();
  });

  it('suggest devuelve candidatos sin ejecutar', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const res = await app.inject({
      method: 'POST',
      url: '/api/commands/suggest',
      headers: { cookie },
      payload: { text: 'evolucion' },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      readOnly: boolean;
      suggestions: { intent: string; labelEs: string }[];
    };
    expect(body.readOnly).toBe(true);
    expect(body.suggestions.length).toBeGreaterThan(0);
    expect(body.suggestions[0]?.intent).toBeTruthy();
    await app.close();
  });

  it('registrar mar pide confirmación sin flag confirmed', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const res = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: {
        text: 'registrar mar',
        patientId: '00000000-0000-4000-8000-000000000001',
      },
    });
    expect(res.statusCode).toBe(200);
    expect((res.json() as { status: string }).status).toBe('needs_confirmation');
    await app.close();
  });

  it('resume sin paciente devuelve needs_patient', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const res = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: { text: 'resume al paciente' },
    });
    expect(res.statusCode).toBe(200);
    expect((res.json() as { status: string }).status).toBe('needs_patient');
    await app.close();
  });
});
