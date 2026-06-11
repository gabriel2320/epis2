/**
 * EPIS2 OpenClaw policy — perfiles L0–L4 + modo max-power auto-dev.
 * L5 (coder autónomo) prohibido — ver PRODUCT_INVARIANTS.
 */

import { getPathTier, validatePatch } from './low-risk-policy.mjs';

export const OPENCLAW_POLICY_VERSION = '0.3.0';

/** Máximo poder auto-dev (L3 patch-code + L4 breadth safe-run). */
export const MAX_POWER_LOCK_DEFAULTS = {
  EPIS2_OPENCLAW_MAX_POWER: '1',
  EPIS2_OPENCLAW_POWER_LEVEL: 'L3',
  EPIS2_OPENCLAW_PATCHING_ENABLED: 'true',
  EPIS2_OPENCLAW_SAFE_RUN: 'true',
  EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL: 'true',
  EPIS2_OPENCLAW_AUTHORIZE_CODE: 'true',
  EPIS2_OPENCLAW_REQUIRE_HUMAN_APPROVAL: 'true',
  EPIS2_OPENCLAW_GIT_WRITE: 'false',
  EPIS2_OPENCLAW_READ_ENV: 'false',
};

/** Alias auto-dev = max power por defecto. */
export const AUTO_DEV_LOCK_DEFAULTS = { ...MAX_POWER_LOCK_DEFAULTS };

/** Sesión manual Cursor sin auto-dev. */
export const SESSION_LOCK_DEFAULTS = {
  EPIS2_OPENCLAW_MAX_POWER: '0',
  EPIS2_OPENCLAW_POWER_LEVEL: 'L0',
  EPIS2_OPENCLAW_PATCHING_ENABLED: 'false',
  EPIS2_OPENCLAW_SAFE_RUN: 'false',
  EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL: 'false',
  EPIS2_OPENCLAW_AUTHORIZE_CODE: 'false',
  EPIS2_OPENCLAW_REQUIRE_HUMAN_APPROVAL: 'true',
  EPIS2_OPENCLAW_GIT_WRITE: 'false',
  EPIS2_OPENCLAW_READ_ENV: 'false',
};

export const ALLOWLIST_COMMANDS = [
  'git status',
  'git status --short',
  'git status --short --branch',
  'git diff --stat',
  'git diff --name-only',
  'npm run check',
  'npm run test',
  'npm run architecture:validate',
  'npm run db:validate',
  'npm run stack:dev',
  'npm run ollama:probe',
  'npm run openclaw:policy',
  'npm run openclaw:brief',
  'npm run openclaw:handoff',
  'npm run openclaw:tramo',
  'npm run openclaw:verify-tramo',
  'npm run dev:openclaw:sync',
  'npm run legacy:validate-manifest',
  'npm run legacy:audit',
  'npm run quality:openclaw-gate',
  'npm run quality:pm03-orchestration-gate',
  'npm run quality:evolab-bridge-gate',
  'npm run quality:auto-dev-6h-gate',
  'npm run quality:dev-env-gate',
  'npm run quality:stack-dev-gate',
  'npm run quality:dev-agent-orchestration-gate',
  'npm run quality:local-ci',
  'npm run quality:microphases',
  'npm run quality:microphase-next',
  'npm run quality:dual-chart-gate',
  'npm run quality:three-modes-gate',
  'npm run quality:dual-chart-legacy-freeze-gate',
  'npm run quality:dual-chart-ledger',
  'npm run quality:ui-simplify-gate',
  'npm run quality:layers-integration-gate',
  'npm run dev:agent:close',
  'npm run dev:session',
];

/** Requiere EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL=true (L2+). */
export const CONDITIONAL_COMMANDS = [
  'npm run dev:agent:ollama-auto',
  'npm run dev:agent:ollama-write',
  'npm run dev:agent:ollama',
  'npm run quality:golden-journey',
  'npm run test:e2e:ux-g02',
  'npm run ai:evals:live',
  'npm run ai:evals:tramo-j',
  'npm run dev:evolab:sync',
  'npm run evolab:smoke',
  'npm run evolab:validate',
  'npm run test:unit:chart',
];

/** L3+ — cualquier npm run quality:* */
export const ALLOWLIST_PREFIXES_L3 = [
  'npm run quality:',
  'npm run openclaw:',
  'npm run dev:openclaw:',
];

/** L4 — además test:e2e:* y dev:agent:* (sin commit). */
export const ALLOWLIST_PREFIXES_L4 = [
  ...ALLOWLIST_PREFIXES_L3,
  'npm run test:e2e:',
  'npm run dev:agent:',
  'npm run dev:auto:',
];

export const DENYLIST_PATTERNS = [
  /\bgit\s+push\b/i,
  /\bgit\s+commit\b/i,
  /\bgit\s+reset\s+--hard\b/i,
  /\bgit\s+clean\s+-fdx\b/i,
  /\brm\s+-rf\b/i,
  /\bdel\s+\/s\b/i,
  /\bnpm\s+audit\s+fix\s+--force\b/i,
  /\bwriteback\b/i,
  /\bopenmrs\b/i,
  /\bcarbon\b/i,
  /\.env(?!\.example)/i,
  /\bdrop\s+database\b/i,
  /\btruncate\s+table\b/i,
];

export const PROFILE_MAP = {
  L0: { id: 'readonly', safeRun: false, safePatch: false, label: 'read-only-reviewer', order: 0 },
  L1: { id: 'verifier', safeRun: true, safePatch: false, label: 'controlled-verifier', order: 1 },
  L2: { id: 'patch-docs', safeRun: true, safePatch: true, label: 'patch-docs', order: 2 },
  L3: {
    id: 'patch-code-limited',
    safeRun: true,
    safePatch: true,
    label: 'max-power-patch-code',
    order: 3,
  },
  L4: {
    id: 'release-review',
    safeRun: true,
    safePatch: false,
    label: 'max-power-release-review',
    order: 4,
  },
};

export function normalizeCommand(cmd) {
  return String(cmd ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/npm\.cmd/g, 'npm');
}

export function normalizeRepoPath(relPath) {
  return String(relPath ?? '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '');
}

export function isDeniedCommand(cmd) {
  const n = normalizeCommand(cmd);
  for (const pat of DENYLIST_PATTERNS) {
    if (pat.test(n)) return { denied: true, reason: `Denylist: ${pat}` };
  }
  return { denied: false };
}

function matchesPrefix(cmd, prefixes) {
  return prefixes.some((p) => cmd.startsWith(p));
}

export function isAllowedCommand(cmd, locks) {
  const n = normalizeCommand(cmd);
  const denied = isDeniedCommand(n);
  if (denied.denied) return { allowed: false, reason: denied.reason, tier: 'deny' };

  if (locks.gitWrite !== true && /\bgit\s+(add|commit|push|merge|rebase)\b/i.test(n)) {
    return { allowed: false, reason: 'EPIS2_OPENCLAW_GIT_WRITE=false', tier: 'deny' };
  }

  const levelOrder = PROFILE_MAP[locks.level]?.order ?? 0;
  if (levelOrder < 1 && locks.safeRun !== true) {
    return { allowed: false, reason: 'EPIS2_OPENCLAW_SAFE_RUN=false (requiere L1+)', tier: 'deny' };
  }

  if (ALLOWLIST_COMMANDS.includes(n)) return { allowed: true, tier: 'allow' };

  if (CONDITIONAL_COMMANDS.includes(n) || CONDITIONAL_COMMANDS.some((c) => n.startsWith(`${c} `))) {
    if (locks.authorizeConditional) return { allowed: true, tier: 'conditional' };
    return {
      allowed: false,
      reason: 'Requiere EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL=true',
      tier: 'conditional',
    };
  }

  if (levelOrder >= 4 && matchesPrefix(n, ALLOWLIST_PREFIXES_L4)) {
    return { allowed: true, tier: 'L4-prefix' };
  }

  if (levelOrder >= 3 && matchesPrefix(n, ALLOWLIST_PREFIXES_L3)) {
    return { allowed: true, tier: 'L3-prefix' };
  }

  if (n.startsWith('git diff --stat') || n.startsWith('git diff --name-only')) {
    return { allowed: true, tier: 'allow' };
  }

  return { allowed: false, reason: `Comando fuera de política: ${n}`, tier: 'unknown' };
}

export function resolveOpenClawLocks(env = process.env) {
  const maxPower = env.EPIS2_OPENCLAW_MAX_POWER === '1' || env.EPIS2_OPENCLAW_MAX_POWER === 'true';
  const level = (
    maxPower ? (env.EPIS2_OPENCLAW_POWER_LEVEL ?? 'L3') : (env.EPIS2_OPENCLAW_POWER_LEVEL ?? 'L0')
  ).toUpperCase();
  const profile = PROFILE_MAP[level] ?? PROFILE_MAP.L0;

  const patchingEnabled =
    env.EPIS2_OPENCLAW_PATCHING_ENABLED === 'true' || env.EPIS2_OPENCLAW_PATCHING_ENABLED === '1';

  return {
    maxPower,
    level,
    profile: profile.id,
    mode: maxPower ? `max-power-${profile.label}` : profile.label,
    patchingEnabled,
    safeRun:
      env.EPIS2_OPENCLAW_SAFE_RUN === '1' ||
      env.EPIS2_OPENCLAW_SAFE_RUN === 'true' ||
      profile.safeRun,
    authorizeConditional:
      env.EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL === '1' ||
      env.EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL === 'true',
    authorizeCode:
      env.EPIS2_OPENCLAW_AUTHORIZE_CODE === '1' || env.EPIS2_OPENCLAW_AUTHORIZE_CODE === 'true',
    requireHumanApproval:
      env.EPIS2_OPENCLAW_REQUIRE_HUMAN_APPROVAL !== '0' &&
      env.EPIS2_OPENCLAW_REQUIRE_HUMAN_APPROVAL !== 'false',
    gitWrite: env.EPIS2_OPENCLAW_GIT_WRITE === '1' || env.EPIS2_OPENCLAW_GIT_WRITE === 'true',
    readEnv: env.EPIS2_OPENCLAW_READ_ENV === '1' || env.EPIS2_OPENCLAW_READ_ENV === 'true',
    safePatch: (profile.safePatch || (patchingEnabled && profile.order >= 2)) && patchingEnabled,
    levelOrder: profile.order,
  };
}

/** Valida paths de patch contra low-risk-policy (L0/L1). */
export function validatePatchPaths(paths, locks = resolveOpenClawLocks()) {
  const results = [];
  let ok = true;
  for (const raw of paths) {
    const path = normalizeRepoPath(raw);
    const tier = getPathTier(path);
    let allowed = false;
    if (tier === 'L0' && locks.safePatch) allowed = true;
    else if (tier === 'L1' && locks.safePatch && locks.authorizeCode && locks.levelOrder >= 3)
      allowed = true;
    else if (tier === 'forbidden') allowed = false;
    else ok = false;
    results.push({ path, tier, allowed, note: allowed ? 'ok' : `tier ${tier}` });
  }
  return { ok, results };
}

export function validatePatchProposalFiles(files, locks = resolveOpenClawLocks()) {
  const paths = files.map((f) => normalizeRepoPath(f.path));
  const pathCheck = validatePatchPaths(paths, locks);
  if (!pathCheck.ok) return pathCheck;

  for (const file of files) {
    const v = validatePatch({
      path: file.path,
      content: file.content ?? '',
      action: file.action ?? 'create',
    });
    if (!v.ok) {
      return {
        ok: false,
        results: [{ path: file.path, tier: v.tier, allowed: false, note: v.reason }],
      };
    }
    if (v.tier === 'L1' && (!locks.authorizeCode || locks.levelOrder < 3)) {
      return {
        ok: false,
        results: [
          { path: file.path, tier: 'L1', allowed: false, note: 'Requiere L3 + AUTHORIZE_CODE' },
        ],
      };
    }
  }
  return pathCheck;
}

export function applyAutoDevOpenClawLocks(env = process.env) {
  const useMax = env.EPIS2_OPENCLAW_MAX_POWER !== '0';
  const defaults = useMax ? MAX_POWER_LOCK_DEFAULTS : AUTO_DEV_LOCK_DEFAULTS;
  const out = { ...env };
  for (const [key, value] of Object.entries(defaults)) {
    if (out[key] == null || out[key] === '') out[key] = value;
  }
  return out;
}

export function openClawSafetyEnv(baseEnv = process.env) {
  return applyAutoDevOpenClawLocks(baseEnv);
}

/** Invariantes duros — nunca relajar (ni max-power). */
export function assertLocksForSafeRun(locks = resolveOpenClawLocks()) {
  const errors = [];
  if (locks.gitWrite) errors.push('EPIS2_OPENCLAW_GIT_WRITE debe ser false (git vía PM-03)');
  if (locks.readEnv) errors.push('EPIS2_OPENCLAW_READ_ENV debe ser false');
  if (locks.level === 'L0' && locks.safeRun)
    errors.push('L0 no permite EPIS2_OPENCLAW_SAFE_RUN=true');
  if (locks.levelOrder >= 5) errors.push('L5 prohibido en EPIS2');
  return errors;
}

export function canUseSafePatch(locks = resolveOpenClawLocks()) {
  return locks.safePatch && locks.levelOrder >= 2;
}

export function loadPatchProposalJson(root, proposalPath, { readFileSync, join, existsSync }) {
  const abs = join(root, proposalPath);
  if (!existsSync(abs)) throw new Error(`Proposal not found: ${proposalPath}`);
  const data = JSON.parse(readFileSync(abs, 'utf8'));
  if (!Array.isArray(data.files)) throw new Error('Proposal requires files[]');
  return data;
}
