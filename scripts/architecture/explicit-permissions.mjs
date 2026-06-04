import { walkSourceFiles } from './lib/scan-sources.mjs';

const WILDCARD_PATTERNS = [
  /permission[s]?\s*[:=]\s*['"]\*['"]/i,
  /['"]admin\.\*['"]/,
  /['"]\*\.\*['"]/,
  /hasPermission\([^)]*['"]\*['"]/,
  /wildcard:\s*true/i,
  /grantAll/i,
  /ALL_PERMISSIONS/i,
];

export async function validate() {
  const details = [];

  for await (const { rel, content } of walkSourceFiles()) {
    if (rel.includes('architecture/explicit-permissions')) continue;
    for (const pattern of WILDCARD_PATTERNS) {
      if (pattern.test(content)) {
        details.push(`${rel} → permiso wildcard ambiguo`);
        break;
      }
    }
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Sin permisos wildcard ambiguos'
        : 'Permisos deben ser explícitos (sin * ni admin.*)',
    details,
  };
}
