/** Cliente Ollama estructurado para dev-agent (chat → generate fallback). */

import { parseJsonFromOllamaText, stripOllamaResponseNoise } from '../ollama/json-from-response.mjs';

export { parseJsonFromOllamaText, stripOllamaResponseNoise };

export async function pingOllama(baseUrl) {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function readOllamaFailure(res) {
  try {
    const body = await res.json();
    if (body.error?.trim()) return `Ollama: ${body.error.trim()}`;
  } catch {
    // ignore
  }
  return `Ollama respondió ${res.status}`;
}

function normalizeText(raw) {
  if (!raw?.trim()) return '';
  return stripOllamaResponseNoise(raw);
}

async function requestChat(base, model, prompt, timeoutMs) {
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      think: false,
      options: { temperature: 0.2, num_predict: 2048 },
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) return { ok: false, reason: await readOllamaFailure(res) };

  const body = await res.json();
  const text = normalizeText(body.message?.content) || normalizeText(body.message?.thinking);
  if (!text) {
    return {
      ok: false,
      reason:
        'Ollama devolvió respuesta vacía (revise modelo o num_predict; use think:false)',
    };
  }

  return { ok: true, text, model: body.model ?? model };
}

async function requestGenerate(base, model, prompt, timeoutMs) {
  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: 'json',
      think: false,
      options: { temperature: 0.2, num_predict: 2048 },
    }),
  });

  if (!res.ok) return { ok: false, reason: await readOllamaFailure(res) };

  const body = await res.json();
  const text = normalizeText(body.response) || normalizeText(body.thinking);
  if (!text) return { ok: false, reason: 'Ollama devolvió respuesta vacía' };

  return { ok: true, text, model: body.model ?? model };
}

export async function generateOllamaJson(baseUrl, model, prompt, timeoutMs = 60_000) {
  const base = baseUrl.replace(/\/$/, '');

  try {
    let lastFailure = { ok: false, reason: 'No se pudo contactar Ollama' };

    for (const attempt of [
      () => requestChat(base, model, prompt, timeoutMs),
      () => requestGenerate(base, model, prompt, timeoutMs),
    ]) {
      const result = await attempt();
      if (!result.ok) {
        lastFailure = result;
        continue;
      }
      const parsed = parseJsonFromOllamaText(result.text);
      if (parsed.ok) return result;
      lastFailure = { ok: false, reason: parsed.reason };
    }

    return lastFailure;
  } catch {
    return { ok: false, reason: 'No se pudo contactar Ollama' };
  }
}
