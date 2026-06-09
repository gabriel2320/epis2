import { SignJWT, jwtVerify } from 'jose';
import { isClinicalRole, type ClinicalRole } from '@epis2/clinical-domain';

export type SessionClaims = {
  sub: string;
  username: string;
  displayName: string;
  role: ClinicalRole;
};

const ISSUER = 'epis2-api';
const AUDIENCE = 'epis2-web';

export async function signSessionToken(
  claims: SessionClaims,
  secret: string,
  ttlSeconds = 60 * 60 * 8,
): Promise<{ token: string; expiresAt: string }> {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const key = new TextEncoder().encode(secret);
  const token = await new SignJWT({
    username: claims.username,
    displayName: claims.displayName,
    role: claims.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(key);
  return { token, expiresAt };
}

export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<SessionClaims | null> {
  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    const sub = payload.sub;
    const username = payload.username;
    const displayName = payload.displayName;
    const role = payload.role;
    if (
      typeof sub !== 'string' ||
      typeof username !== 'string' ||
      typeof displayName !== 'string' ||
      typeof role !== 'string' ||
      !isClinicalRole(role)
    ) {
      return null;
    }
    return { sub, username, displayName, role };
  } catch {
    return null;
  }
}
