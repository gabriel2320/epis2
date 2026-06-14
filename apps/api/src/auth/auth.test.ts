import { afterEach, describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { clearMemoryAudit } from '../audit/store.js';
import { testApiConfig } from '../testConfig.js';
import { SERVICE_API_KEY_HEADER } from './serviceAccount.js';

const config = testApiConfig;

afterEach(() => {
  clearMemoryAudit();
});

describe('auth routes', () => {
  it('rechaza login con clave incorrecta', async () => {
    const app = await buildApp(config);
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'CLAVE-INCORRECTA' },
    });
    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it('login exitoso establece cookie y devuelve permisos explícitos', async () => {
    const app = await buildApp(config);
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { permissions: string[]; user: { role: string } };
    expect(body.user.role).toBe('physician');
    expect(body.permissions).toContain('draft.approve');
    expect(body.permissions.some((p) => p.includes('*'))).toBe(false);
    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    await app.close();
  });

  it('GET /api/auth/session requiere cookie', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookieHeader = login.headers['set-cookie'];
    const session = await app.inject({
      method: 'GET',
      url: '/api/auth/session',
      headers: { cookie: String(cookieHeader).split(';')[0] },
    });
    expect(session.statusCode).toBe(200);
    await app.close();
  });

  it('auditor puede leer audit login; enfermería no', async () => {
    const app = await buildApp(config);
    const nurseLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'enfermeria.demo', demoAuthKey: 'DEMO-CLAVE-ENFERMERIA' },
    });
    const nurseCookie = String(nurseLogin.headers['set-cookie']).split(';')[0];
    const denied = await app.inject({
      method: 'GET',
      url: '/api/auth/audit/login',
      headers: { cookie: nurseCookie },
    });
    expect(denied.statusCode).toBe(403);

    const auditorLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'auditor.demo', demoAuthKey: 'DEMO-CLAVE-AUDITOR' },
    });
    const auditorCookie = String(auditorLogin.headers['set-cookie']).split(';')[0];
    const allowed = await app.inject({
      method: 'GET',
      url: '/api/auth/audit/login',
      headers: { cookie: auditorCookie },
    });
    expect(allowed.statusCode).toBe(200);
    await app.close();
  });

  it('hybrid: service API key autentica como auditor read-only', async () => {
    const hybridConfig = {
      ...config,
      AUTH_MODE: 'hybrid' as const,
      SERVICE_API_KEY: 'test-service-key-min-32-chars-long',
    };
    const app = await buildApp(hybridConfig);
    const res = await app.inject({
      method: 'GET',
      url: '/api/audit/events',
      headers: { [SERVICE_API_KEY_HEADER]: hybridConfig.SERVICE_API_KEY },
    });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('hybrid: rechaza service key inválida', async () => {
    const hybridConfig = {
      ...config,
      AUTH_MODE: 'hybrid' as const,
      SERVICE_API_KEY: 'test-service-key-min-32-chars-long',
    };
    const app = await buildApp(hybridConfig);
    const res = await app.inject({
      method: 'GET',
      url: '/api/audit/events',
      headers: { [SERVICE_API_KEY_HEADER]: 'clave-invalida' },
    });
    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it('rechaza login demo en staging (MF-CON-05)', async () => {
    const stagingConfig = {
      ...config,
      NODE_ENV: 'staging' as const,
      RLS_MODE: 'enforce' as const,
      AUTH_MODE: 'hybrid' as const,
      SESSION_SECRET: 'staging-test-session-min-32-chars',
    };
    const app = await buildApp(stagingConfig);
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    expect(res.statusCode).toBe(403);
    await app.close();
  });
});
