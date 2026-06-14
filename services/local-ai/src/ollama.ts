import { parseJsonFromOllamaText, stripOllamaResponseNoise } from './extractOllamaJson.js';

export async function pingOllama(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type OllamaGenerateResult =
  | { ok: true; text: string; model: string }
  | { ok: false; reason: string };

type OllamaErrorBody = { error?: string };

function normalizeOllamaText(raw: string | undefined): string {
  if (!raw?.trim()) return '';
  return stripOllamaResponseNoise(raw);
}

async function readOllamaFailure(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as OllamaErrorBody;
    if (body.error?.trim()) return `Ollama: ${body.error.trim()}`;
  } catch {
    // ignore
  }
  return `Ollama respondió ${res.status}`;
}

async function requestOllamaChat(
  base: string,
  model: string,
  prompt: string,
  timeoutMs: number,
): Promise<OllamaGenerateResult> {
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      think: false,
      options: {
        temperature: 0.2,
        num_predict: 2048,
      },
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    return { ok: false, reason: await readOllamaFailure(res) };
  }

  const body = (await res.json()) as {
    model?: string;
    message?: { content?: string; thinking?: string };
  };
  const text =
    normalizeOllamaText(body.message?.content) || normalizeOllamaText(body.message?.thinking);

  if (!text) {
    return {
      ok: false,
      reason: 'Ollama devolvió respuesta vacía (revise modelo, num_predict o desactive think)',
    };
  }

  return { ok: true, text, model: body.model ?? model };
}

async function requestOllamaGenerate(
  base: string,
  model: string,
  prompt: string,
  timeoutMs: number,
): Promise<OllamaGenerateResult> {
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
      options: {
        temperature: 0.2,
        num_predict: 2048,
      },
    }),
  });

  if (!res.ok) {
    return { ok: false, reason: await readOllamaFailure(res) };
  }

  const body = (await res.json()) as {
    response?: string;
    thinking?: string;
    model?: string;
  };
  const text = normalizeOllamaText(body.response) || normalizeOllamaText(body.thinking);

  if (!text) {
    return { ok: false, reason: 'Ollama devolvió respuesta vacía' };
  }

  return { ok: true, text, model: body.model ?? model };
}

export async function generateOllamaJson(
  baseUrl: string,
  prompt: string,
  model: string,
  timeoutMs = 45_000,
): Promise<OllamaGenerateResult> {
  const base = baseUrl.replace(/\/$/, '');

  try {
    let lastFailure: OllamaGenerateResult = {
      ok: false,
      reason: 'No se pudo contactar Ollama',
    };

    for (const attempt of [
      () => requestOllamaChat(base, model, prompt, timeoutMs),
      () => requestOllamaGenerate(base, model, prompt, timeoutMs),
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

export type OllamaEmbeddingResult =
  | { ok: true; embedding: number[]; model: string }
  | { ok: false; reason: string };

export async function fetchOllamaEmbedding(
  baseUrl: string,
  model: string,
  text: string,
  timeoutMs = 12_000,
): Promise<OllamaEmbeddingResult> {
  const base = baseUrl.replace(/\/$/, '');
  try {
    const res = await fetch(`${base}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify({ model, prompt: text }),
    });
    if (!res.ok) {
      return { ok: false, reason: await readOllamaFailure(res) };
    }
    const body = (await res.json()) as { embedding?: number[]; model?: string };
    if (!Array.isArray(body.embedding) || body.embedding.length === 0) {
      return { ok: false, reason: 'Ollama devolvió embedding vacío' };
    }
    return { ok: true, embedding: body.embedding, model: body.model ?? model };
  } catch {
    return { ok: false, reason: 'No se pudo contactar Ollama' };
  }
}
