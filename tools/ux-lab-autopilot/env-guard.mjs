/** Modo A — Ollama off, dual chart on, demo signals expected. */
export function buildModeAEnv() {
  return {
    OLLAMA_BASE_URL: 'http://127.0.0.1:59999',
    VITE_ENABLE_DUAL_CHART_MODES: 'true',
    EPIS2_UX_LAB_AUTOPILOT: '1',
  };
}

export async function checkStackHealth() {
  const apiUrl = process.env.PLAYWRIGHT_API_HEALTH_URL ?? 'http://127.0.0.1:3001/health';
  try {
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
    return { ok: res.ok, status: res.status, url: apiUrl };
  } catch (error) {
    return { ok: false, url: apiUrl, error: String(error) };
  }
}

export function applyModeAEnv(base = process.env) {
  const env = buildModeAEnv();
  return { ...base, ...env };
}
