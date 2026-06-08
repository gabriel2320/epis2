/**
 * Enrutador Ollama — alterna modelos según estación y función.
 * Clínica: fijo en OLLAMA_MODEL (qwen3:8b). Dev: auto por tier + modelos instalados.
 */
import { getOllamaEnv, isModelInstalled, probeOllamaNative } from './ollama-core.mjs';
import { getWorkstationProfile } from './workstation-profile.mjs';

/** @typedef {'clinical' | 'dev-plan' | 'dev-write'} OllamaFunction */

export const OLLAMA_FUNCTIONS = /** @type {const} */ (['clinical', 'dev-plan', 'dev-write']);

/** Candidatos por función y tier (orden = preferencia). */
export const FUNCTION_ROUTE_CANDIDATES = {
  clinical: {
    minimal: ['qwen3:8b'],
    standard: ['qwen3:8b'],
    performance: ['qwen3:8b'],
  },
  'dev-plan': {
    minimal: ['qwen2.5-coder:7b', 'deepseek-coder:6.7b', 'qwen3:8b'],
    standard: ['qwen2.5-coder:7b', 'deepseek-coder:6.7b', 'qwen3:8b'],
    performance: ['qwen2.5-coder:7b', 'deepseek-coder:6.7b', 'qwen3:8b'],
  },
  'dev-write': {
    minimal: ['qwen2.5-coder:7b', 'deepseek-coder:6.7b', 'qwen3:8b'],
    standard: ['qwen2.5-coder:14b', 'qwen2.5-coder:7b', 'deepseek-coder:6.7b', 'qwen3:8b'],
    performance: [
      'deepseek-coder-v2:16b',
      'qwen2.5-coder:14b',
      'qwen2.5-coder:7b',
      'deepseek-coder:6.7b',
      'qwen3:8b',
    ],
  },
};

const ENV_OVERRIDE_KEYS = {
  clinical: 'OLLAMA_ROUTE_CLINICAL',
  'dev-plan': 'OLLAMA_ROUTE_DEV_PLAN',
  'dev-write': 'OLLAMA_ROUTE_DEV_WRITE',
};

/** @param {OllamaFunction} fn */
export function getFunctionOverride(fn) {
  const key = ENV_OVERRIDE_KEYS[fn];
  const val = process.env[key]?.trim();
  return val || null;
}

/** @param {OllamaFunction} fn @param {string} tier */
export function getCandidates(fn, tier) {
  const table = FUNCTION_ROUTE_CANDIDATES[fn];
  return table?.[tier] ?? table?.standard ?? ['qwen3:8b'];
}

/**
 * @param {OllamaFunction} fn
 * @param {{ tier?: string, installedModels?: string[], override?: string | null }} opts
 */
export function pickModelForFunction(fn, opts = {}) {
  const profile = getWorkstationProfile();
  const tier = opts.tier ?? profile.tier;
  const installed = opts.installedModels ?? [];
  const override = opts.override ?? getFunctionOverride(fn);

  if (override) {
    if (installed.length === 0 || isModelInstalled(installed, override)) {
      return { model: override, tier, mode: 'override', candidates: [override], fallbackUsed: false };
    }
  }

  const routeMode = (process.env.OLLAMA_ROUTE_MODE ?? 'auto').trim().toLowerCase();
  if (routeMode === 'fixed') {
    const env = getOllamaEnv(fn === 'clinical' ? {} : { role: 'dev' });
    return {
      model: env.model,
      tier,
      mode: 'fixed',
      candidates: [env.model],
      fallbackUsed: false,
    };
  }

  const candidates = getCandidates(fn, tier);
  for (const candidate of candidates) {
    if (installed.length === 0 || isModelInstalled(installed, candidate)) {
      return {
        model: candidate,
        tier,
        mode: 'auto',
        candidates,
        fallbackUsed: candidate !== candidates[0],
      };
    }
  }

  return {
    model: candidates[candidates.length - 1],
    tier,
    mode: 'auto',
    candidates,
    fallbackUsed: true,
    missing: true,
  };
}

/**
 * @param {{ function?: OllamaFunction, baseUrl?: string, tier?: string }} [opts]
 */
export async function resolveOllamaRoute(opts = {}) {
  const fn = opts.function ?? 'clinical';
  const baseUrl = opts.baseUrl ?? getOllamaEnv().baseUrl;
  const profile = getWorkstationProfile();
  const tier = opts.tier ?? profile.tier;

  const probe = await probeOllamaNative(baseUrl);
  const installedModels = probe.ok ? probe.models : [];

  const picked = pickModelForFunction(fn, {
    tier,
    installedModels,
    override: getFunctionOverride(fn),
  });

  return {
    baseUrl,
    function: fn,
    ...picked,
    workstation: profile,
    installedModels,
    ollamaUp: probe.ok,
  };
}

/** @param {Record<OllamaFunction, Awaited<ReturnType<typeof resolveOllamaRoute>>>} routes */
export function formatRouteTable(routes) {
  const lines = [];
  const ws = routes.clinical?.workstation ?? getWorkstationProfile();
  lines.push(`Estación: tier ${ws.tier} · ${ws.ramGb} GB RAM · ${ws.vramGb || '?'} GB VRAM · ${ws.cpuCores} cores`);
  lines.push(`Modo: ${process.env.OLLAMA_ROUTE_MODE ?? 'auto'}`);
  lines.push('');
  for (const fn of OLLAMA_FUNCTIONS) {
    const r = routes[fn];
    if (!r) continue;
    const ready = r.installedModels?.length ? isModelInstalled(r.installedModels, r.model) : '?';
    const flag = r.missing ? '✗ falta pull' : ready === true ? '✓' : ready === false ? '✗' : '?';
    const fb = r.fallbackUsed ? ' (fallback)' : '';
    lines.push(`  ${fn.padEnd(10)} → ${r.model}  ${flag}${fb}`);
  }
  return lines.join('\n');
}

/** Resuelve rutas para todas las funciones EPIS2. */
export async function resolveAllOllamaRoutes(baseUrl) {
  /** @type {Record<string, Awaited<ReturnType<typeof resolveOllamaRoute>>>} */
  const routes = {};
  for (const fn of OLLAMA_FUNCTIONS) {
    routes[fn] = await resolveOllamaRoute({ function: fn, baseUrl });
  }
  return routes;
}
