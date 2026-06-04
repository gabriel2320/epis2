import { describe, expect, it } from 'vitest';
import { resolveCommand } from '@epis2/command-registry';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

describe('dashboard API', () => {
  it('GET /api/dashboard/work requiere sesión', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/api/dashboard/work' });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/dashboard/work responde agregado demo con sesión', async () => {
    const app = await buildApp(testApiConfig);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    expect(login.statusCode).toBe(200);
    const cookie = login.headers['set-cookie'];
    const res = await app.inject({
      method: 'GET',
      url: '/api/dashboard/work',
      headers: { cookie },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      readOnly: boolean;
      myOpenDrafts: unknown[];
      demoTasks: { id: string }[];
    };
    expect(body.readOnly).toBe(true);
    expect(body.demoTasks.length).toBeGreaterThan(0);
  });
});

describe('dashboard commands', () => {
  it('ver mi trabajo resuelve tab work', () => {
    const r = resolveCommand({ text: 'ver mi trabajo', role: 'nurse' });
    expect(r.status).toBe('resolved');
    if (r.status === 'resolved') {
      expect(r.intent).toBe('open_dashboard_work');
    }
  });
});
