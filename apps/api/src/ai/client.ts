import type { AiAssistDraftRequest } from '@epis2/contracts';

export type LocalAiAssistResult =
  | {
      status: 'success';
      suggestedFields: Record<string, string>;
      safetyNotes: string[];
      requiresHumanReview: true;
      model: string;
      latencyMs: number;
      promptHash: string;
    }
  | {
      status: 'unavailable' | 'rejected';
      message: string;
      promptHash?: string;
      model?: string;
      latencyMs?: number;
    };

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

export async function fetchLocalAiStatus(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/ready`, {
      signal: AbortSignal.timeout(2500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function requestDraftAssist(
  baseUrl: string,
  body: AiAssistDraftRequest,
): Promise<{ httpStatus: number; body: LocalAiAssistResult }> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/assist/draft-suggestion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify(body),
  });

  const payload = (await res.json()) as LocalAiAssistResult;
  return { httpStatus: res.status, body: payload };
}
