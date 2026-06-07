import { describeIntegration } from '@epis2/test-fixtures/integration';
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

  it('GET /api/dashboard/quality requiere sesión', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/api/dashboard/quality' });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/dashboard/service requiere sesión', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/api/dashboard/service' });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/dashboard/nursing requiere sesión', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/api/dashboard/nursing' });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/dashboard/pharmacy requiere sesión', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/api/dashboard/pharmacy' });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/dashboard/icu requiere sesión', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/api/dashboard/icu' });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/dashboard/patient/:id requiere sesión', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({
      method: 'GET',
      url: '/api/dashboard/patient/a0000001-0000-4000-8000-000000000001',
    });
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

describeIntegration('dashboard role boards', () => {
  const config = { ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL };

  it('GET /api/dashboard/nursing con enfermería devuelve MAR programado', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'enfermeria.demo', demoAuthKey: 'DEMO-CLAVE-ENFERMERIA' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];
    const res = await app.inject({
      method: 'GET',
      url: '/api/dashboard/nursing',
      headers: { cookie },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      roleView: string;
      scheduledMar: unknown[];
      demoTasks: { id: string }[];
    };
    expect(body.roleView).toBe('nurse');
    expect(body.scheduledMar.length).toBeGreaterThan(0);
    expect(body.demoTasks.some((t) => t.id === 'nurse-task-mar')).toBe(true);
    await app.close();
  });

  it('GET /api/dashboard/pharmacy con farmacia devuelve conciliación', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'farmacia.demo', demoAuthKey: 'DEMO-CLAVE-FARMACIA' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];
    const res = await app.inject({
      method: 'GET',
      url: '/api/dashboard/pharmacy',
      headers: { cookie },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      roleView: string;
      reconciliationCandidates: unknown[];
      demoTasks: { id: string }[];
    };
    expect(body.roleView).toBe('pharmacist');
    expect(body.reconciliationCandidates.length).toBeGreaterThan(0);
    expect(body.demoTasks.some((t) => t.id === 'pharm-task-validation')).toBe(true);
    await app.close();
  });

  it('GET /api/dashboard/work filtra tareas por rol enfermería', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'enfermeria.demo', demoAuthKey: 'DEMO-CLAVE-ENFERMERIA' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];
    const res = await app.inject({
      method: 'GET',
      url: '/api/dashboard/work',
      headers: { cookie },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { roleView: string; demoTasks: { id: string }[] };
    expect(body.roleView).toBe('nurse');
    expect(body.demoTasks.every((t) => t.id.includes('mar') || t.id.includes('nursing'))).toBe(
      true,
    );
    await app.close();
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
