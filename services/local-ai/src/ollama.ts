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

export async function generateOllamaJson(
  baseUrl: string,
  prompt: string,
  model: string,
  timeoutMs = 45_000,
): Promise<OllamaGenerateResult> {
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
      }),
    });

    if (!res.ok) {
      return { ok: false, reason: `Ollama respondió ${res.status}` };
    }

    const body = (await res.json()) as { response?: string; model?: string };
    if (!body.response?.trim()) {
      return { ok: false, reason: 'Ollama devolvió respuesta vacía' };
    }

    return {
      ok: true,
      text: body.response,
      model: body.model ?? model,
    };
  } catch {
    return { ok: false, reason: 'No se pudo contactar Ollama' };
  }
}
