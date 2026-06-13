/**
 * Cliente Ollama mínimo para clinical-case-intel (capa dev/datos).
 * Degradación silenciosa — el pipeline funciona sin Ollama (invariante 15).
 */

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

export type OllamaJsonResult =
  | { ok: true; json: unknown; model: string }
  | { ok: false; reason: string };

export async function generateOllamaJson(
  baseUrl: string,
  prompt: string,
  model: string,
  timeoutMs = 90_000,
): Promise<OllamaJsonResult> {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: 'json',
        think: false,
        options: { temperature: 0.3, num_predict: 1536, num_ctx: 4096 },
      }),
    });
    if (!res.ok) {
      return { ok: false, reason: `Ollama respondió ${res.status}` };
    }
    const body = (await res.json()) as { response?: string; model?: string };
    const text = body.response?.trim();
    if (!text) {
      return { ok: false, reason: 'Ollama devolvió respuesta vacía' };
    }
    try {
      return { ok: true, json: JSON.parse(text), model: body.model ?? model };
    } catch {
      return { ok: false, reason: 'Respuesta Ollama no es JSON válido' };
    }
  } catch {
    return { ok: false, reason: 'No se pudo contactar Ollama' };
  }
}
