import { describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';

const config = {
  NODE_ENV: 'test' as const,
  API_HOST: '127.0.0.1',
  API_PORT: 3001,
  SESSION_SECRET: 'test-secret-min-16-chars',
  SESSION_COOKIE_NAME: 'epis2_session',
  WEB_ORIGIN: 'http://127.0.0.1:5173',
  DATABASE_URL: undefined,
};

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
