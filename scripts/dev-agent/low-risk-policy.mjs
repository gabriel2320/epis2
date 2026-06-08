import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** Tier L0 — aplicable con dev:agent:ollama-write --apply */
export const LOW_RISK_TIER_L0_PREFIXES = [
  'reports/',
  'docs/product/',
  'docs/design/',
];

/** Tier L0 archivos sueltos */
export const LOW_RISK_TIER_L0_FILES = [];

/** Tier L1 — solo en plan; no --apply automático */
export const LOW_RISK_TIER_L1_PREFIXES = ['scripts/quality/validate-', 'scripts/dev-agent/'];

export const LOW_RISK_TIER_L1_FILES = ['packages/design-system/src/copy/es.ts'];

export const LOW_RISK_TIER_L1_GLOB = ['.test.ts', '.test.tsx', '.test.mjs'];

/** Tier X — nunca */
export const FORBIDDEN_PATH_PREFIXES = [
  'database/',
  'apps/api/',
  'services/local-ai/',
  'apps/web/src/pages/',
  'packages/command-registry/',
  'packages/clinical-forms/',
  'legacy-import-manifest.json',
];

export const FORBIDDEN_PATH_EXACT = [
  'docs/product/PRODUCT_INVARIANTS.md',
  'docs/PRODUCT_CANON.md',
  'package-lock.json',
  '.env',
];

export const FORBIDDEN_CONTENT_PATTERNS = [
  /auto[\s_-]?approve/i,
  /aprobar\s+automaticamente/i,
  /OpenMRS/i,
  /@carbon\//i,
  /from ['"]@mui\//,
  /DATABASE_URL\s*=/,
  /\bINSERT INTO\b/i,
  /\bUPDATE encounters SET\b/i,
  /\bDELETE FROM\b/i,
  /legacy-import-manifest/i,
  /require\s*\(\s*['"]\.\.\/Epis/i,
];

export function normalizeRelPath(path) {
  return String(path).replace(/\\/g, '/').replace(/^\.\//, '');
}

export function getPathTier(relPath) {
  const p = normalizeRelPath(relPath);

  for (const exact of FORBIDDEN_PATH_EXACT) {
    if (p === exact) return 'forbidden';
  }
  for (const prefix of FORBIDDEN_PATH_PREFIXES) {
    if (p.startsWith(prefix)) return 'forbidden';
  }

  if (LOW_RISK_TIER_L0_FILES.includes(p)) return 'L0';
  if (LOW_RISK_TIER_L0_PREFIXES.some((prefix) => p.startsWith(prefix))) return 'L0';

  if (LOW_RISK_TIER_L1_FILES.includes(p)) return 'L1';
  if (LOW_RISK_TIER_L1_PREFIXES.some((prefix) => p.startsWith(prefix))) return 'L1';
  if (LOW_RISK_TIER_L1_GLOB.some((suffix) => p.endsWith(suffix))) return 'L1';

  return 'forbidden';
}

export function validatePatchContent(content) {
  for (const pattern of FORBIDDEN_CONTENT_PATTERNS) {
    if (pattern.test(content)) {
      return { ok: false, reason: `Contenido prohibido: ${pattern}` };
    }
  }
  return { ok: true };
}

export function validatePatch(patch) {
  const tier = getPathTier(patch.path);
  if (tier === 'forbidden') {
    return { ok: false, reason: `Path fuera de política: ${patch.path}`, tier };
  }

  const contentCheck = validatePatchContent(patch.content);
  if (!contentCheck.ok) {
    return { ok: false, reason: contentCheck.reason, tier };
  }

  if (!['create', 'append'].includes(patch.action)) {
    return { ok: false, reason: `Acción no soportada: ${patch.action}`, tier };
  }

  return { ok: true, tier };
}

/**
 * @param {import('./schemas.mjs').DevLowRiskWritePlan['patches']} patches
 * @param {{ root: string, applyTier?: 'L0' | 'L0+L1' }} opts
 */
export function applyLowRiskPatches(patches, { root, applyTier = 'L0' }) {
  const applied = [];
  const skipped = [];
  const errors = [];

  for (const patch of patches) {
    const validation = validatePatch(patch);
    if (!validation.ok) {
      errors.push({ patch, error: validation.reason });
      continue;
    }

    const allowL1 = applyTier === 'L0+L1';
    if (validation.tier === 'L1' && !allowL1) {
      skipped.push({ patch, reason: 'Tier L1 — aplicar manualmente' });
      continue;
    }

    const abs = join(root, normalizeRelPath(patch.path));

    try {
      if (patch.action === 'create') {
        if (existsSync(abs)) {
          errors.push({ patch, error: 'create: archivo ya existe' });
          continue;
        }
        mkdirSync(dirname(abs), { recursive: true });
        writeFileSync(abs, patch.content, 'utf8');
      } else if (patch.action === 'append') {
        if (!existsSync(abs)) {
          errors.push({ patch, error: 'append: archivo no existe' });
          continue;
        }
        const existing = readFileSync(abs, 'utf8');
        const separator = existing.endsWith('\n') ? '\n' : '\n\n';
        appendFileSync(abs, separator + patch.content, 'utf8');
      }

      applied.push({ patch, tier: validation.tier });
    } catch (err) {
      errors.push({
        patch,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { applied, skipped, errors };
}
