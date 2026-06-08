/** Primitivas Ollama compartidas (sin enrutador). */

export function getOllamaEnv(opts = {}) {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  const clinicalModel = process.env.OLLAMA_MODEL ?? 'qwen3:8b';
  const devModel = process.env.OLLAMA_DEV_MODEL ?? clinicalModel;
  const model = opts.role === 'dev' || opts.dev === true ? devModel : clinicalModel;
  return { baseUrl, model, clinicalModel, devModel };
}

export function isModelInstalled(models, model) {
  const names = models ?? [];
  if (names.includes(model)) return true;
  const colon = model.indexOf(':');
  if (colon < 0) {
    const base = model;
    return names.some((n) => n === model || n.startsWith(`${base}:`));
  }
  const base = model.slice(0, colon);
  const tag = model.slice(colon + 1);
  return names.some((n) => {
    if (n === model) return true;
    if (!n.startsWith(`${base}:`)) return false;
    const nTag = n.slice(base.length + 1);
    return nTag === tag || nTag.startsWith(`${tag}-`);
  });
}

/** @returns {Promise<{ ok: true, models: string[] } | { ok: false, reason: string }>} */
export async function probeOllamaNative(baseUrl, timeoutMs = 5000) {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/tags`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return { ok: false, reason: `Ollama HTTP ${res.status}` };
    const body = await res.json();
    const models = (body.models ?? []).map((m) => String(m.name));
    return { ok: true, models };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : 'Ollama no responde',
    };
  }
}
