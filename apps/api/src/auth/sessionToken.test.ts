import { describe, expect, it } from 'vitest';
import { SignJWT } from 'jose';
import { signSessionToken, verifySessionToken } from './sessionToken.js';

const SECRET = 'epis2-test-session-secret-min-16';

describe('sessionToken', () => {
  it('firma y verifica claims válidos', async () => {
    const { token } = await signSessionToken(
      { sub: 'u1', username: 'medico.demo', displayName: 'Dr. Demo', role: 'physician' },
      SECRET,
    );
    const claims = await verifySessionToken(token, SECRET);
    expect(claims?.sub).toBe('u1');
    expect(claims?.role).toBe('physician');
  });

  it('rechaza token con rol fuera de CLINICAL_ROLES (A3 auditoría)', async () => {
    const key = new TextEncoder().encode(SECRET);
    const forged = await new SignJWT({
      username: 'intruso',
      displayName: 'Intruso',
      role: 'superadmin',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('u1')
      .setIssuer('epis2-api')
      .setAudience('epis2-web')
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(key);
    expect(await verifySessionToken(forged, SECRET)).toBeNull();
  });

  it('rechaza token firmado con otro secret', async () => {
    const { token } = await signSessionToken(
      { sub: 'u1', username: 'medico.demo', displayName: 'Dr. Demo', role: 'physician' },
      'otro-secret-distinto-min-16-chars',
    );
    expect(await verifySessionToken(token, SECRET)).toBeNull();
  });
});
