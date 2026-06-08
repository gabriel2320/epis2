/** Parser JSON compartido para respuestas Ollama (dev-agent + smoke). */

const THINK_TAG = 'think';
const THINK_BLOCK = new RegExp('<' + THINK_TAG + '>[\\s\\S]*?</' + THINK_TAG + '>', 'gi');
const MARKDOWN_FENCE = /```(?:json)?\s*([\s\S]*?)```/i;

export function stripOllamaResponseNoise(raw) {
  let text = String(raw ?? '').trim();
  const fenced = text.match(MARKDOWN_FENCE);
  if (fenced?.[1]) text = fenced[1].trim();
  text = text.replace(THINK_BLOCK, '').trim();
  return text;
}

export function extractFirstJsonObject(text) {
  const start = text.indexOf('{');
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i += 1) {
    const char = text[i];
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }

  return null;
}

export function parseJsonFromOllamaText(raw) {
  const cleaned = stripOllamaResponseNoise(raw);
  if (!cleaned) return { ok: false, reason: 'Respuesta IA vacía' };

  try {
    return { ok: true, value: JSON.parse(cleaned) };
  } catch {
    // continuar
  }

  const block = extractFirstJsonObject(cleaned);
  if (!block) return { ok: false, reason: 'Respuesta IA no contiene JSON' };

  try {
    return { ok: true, value: JSON.parse(block) };
  } catch {
    return { ok: false, reason: 'Respuesta IA no es JSON válido' };
  }
}
