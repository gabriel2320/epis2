import { DRAFT_ASSIST_JSON_SCHEMA } from './draftAssistJsonSchema.js';
import type { InferenceProvider } from './types.js';

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
      refusal?: string | null;
    };
  }>;
  model?: string;
  error?: { message?: string };
};

export async function pingOpenAi(apiKey: string, baseUrl = 'https://api.openai.com/v1'): Promise<boolean> {
  if (!apiKey.trim()) return false;
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function createOpenAiProvider(
  apiKey: string,
  model: string,
  baseUrl = 'https://api.openai.com/v1',
): InferenceProvider {
  return {
    id: 'openai',
    ping: () => pingOpenAi(apiKey, baseUrl),
    generateStructuredJson: async (prompt, timeoutMs = 45_000) => {
      if (!apiKey.trim()) {
        return { ok: false, reason: 'OpenAI API key no configurada', provider: 'openai' };
      }

      try {
        const res = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(timeoutMs),
          body: JSON.stringify({
            model,
            temperature: 0.2,
            messages: [{ role: 'user', content: prompt }],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'epis2_draft_assist',
                strict: true,
                schema: DRAFT_ASSIST_JSON_SCHEMA,
              },
            },
          }),
        });

        if (!res.ok) {
          const errBody = (await res.json().catch(() => ({}))) as OpenAiChatResponse;
          const msg = errBody.error?.message ?? `OpenAI respondió ${res.status}`;
          return { ok: false, reason: msg, provider: 'openai' };
        }

        const body = (await res.json()) as OpenAiChatResponse;
        const message = body.choices?.[0]?.message;
        if (message?.refusal) {
          return { ok: false, reason: message.refusal, provider: 'openai' };
        }
        const content = message?.content?.trim();
        if (!content) {
          return { ok: false, reason: 'OpenAI devolvió respuesta vacía', provider: 'openai' };
        }

        return {
          ok: true,
          text: content,
          model: body.model ?? model,
          provider: 'openai',
        };
      } catch {
        return { ok: false, reason: 'No se pudo contactar OpenAI', provider: 'openai' };
      }
    },
  };
}
