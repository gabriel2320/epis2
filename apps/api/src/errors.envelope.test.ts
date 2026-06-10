import { apiErrorSchema } from '@epis2/contracts';
import { describe, expect, it } from 'vitest';
import { buildApp } from './app.js';
import { testApiConfig } from './testConfig.js';

/**
 * Gate MF-NORM-202: toda respuesta de error de la API cumple el envelope
 * compartido { code, message, correlationId, details? } (apiErrorSchema).
 */
describe('envelope de error compartido (MF-NORM-202)', () => {
  async function loginCookie(app: Awaited<ReturnType<typeof buildApp>>) {
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    expect(login.statusCode).toBe(200);
    return String(login.headers['set-cookie']).split(';')[0] ?? '';
  }

  function expectEnvelope(body: unknown, code: string, correlationHeader: unknown) {
    const parsed = apiErrorSchema.safeParse(body);
    expect(parsed.success, `no cumple apiErrorSchema: ${JSON.stringify(body)}`).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.code).toBe(code);
    expect(parsed.data.correlationId).toBe(String(correlationHeader));
  }

  it('400 (body inválido) cumple el schema con code VALIDATION', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 123 },
    });
    expect(res.statusCode).toBe(400);
    expectEnvelope(res.json(), 'VALIDATION', res.headers['x-correlation-id']);
    await app.close();
  });

  it('401 (sin sesión) cumple el schema con code UNAUTHORIZED', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/api/dashboard/work' });
    expect(res.statusCode).toBe(401);
    expectEnvelope(res.json(), 'UNAUTHORIZED', res.headers['x-correlation-id']);
    await app.close();
  });

  it('403 (rol sin permiso) cumple el schema con code FORBIDDEN', async () => {
    const app = await buildApp(testApiConfig);
    const cookie = await loginCookie(app);
    // medico.demo no tiene admin.users.read → 403 del preHandler requirePermission.
    const res = await app.inject({
      method: 'GET',
      url: '/api/admin/users',
      headers: { cookie },
    });
    expect(res.statusCode).toBe(403);
    expectEnvelope(res.json(), 'FORBIDDEN', res.headers['x-correlation-id']);
    await app.close();
  });

  it('404 (ruta inexistente) cumple el schema con code NOT_FOUND', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/api/no-existe' });
    expect(res.statusCode).toBe(404);
    expectEnvelope(res.json(), 'NOT_FOUND', res.headers['x-correlation-id']);
    await app.close();
  });

  it('500 (error no controlado) cumple el schema con code INTERNAL y mensaje genérico', async () => {
    const app = await buildApp(testApiConfig);
    app.get('/boom', () => {
      throw new Error('detalle interno que no debe filtrarse');
    });
    const res = await app.inject({ method: 'GET', url: '/boom' });
    expect(res.statusCode).toBe(500);
    expectEnvelope(res.json(), 'INTERNAL', res.headers['x-correlation-id']);
    expect((res.json() as { message: string }).message).toBe('Error interno');
    await app.close();
  });
});
