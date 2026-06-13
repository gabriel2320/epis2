export const LOCAL_AI_API_KEY_HEADER = 'x-local-ai-key';

export function buildLocalAiRequestHeaders(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers[LOCAL_AI_API_KEY_HEADER] = apiKey;
  return headers;
}
