/** Cliente Ollama mínimo para asistente de desarrollo (sin dependencia de build local-ai). */

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

export async function generateOllamaJson(baseUrl, model, prompt, timeoutMs = 60_000) {
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

    const body = await res.json();
    if (!body.response?.trim()) {
      return { ok: false, reason: 'Ollama devolvió respuesta vacía' };
    }

    return { ok: true, text: body.response, model: body.model ?? model };
  } catch {
    return { ok: false, reason: 'No se pudo contactar Ollama' };
  }
}
