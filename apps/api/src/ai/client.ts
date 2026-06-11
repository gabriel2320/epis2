import type { AiAssistDraftRequest, AiTextboxAssistRequest } from '@epis2/contracts';

export type LocalAiAssistResult =
  | {
      status: 'success';
      suggestedFields: Record<string, string>;
      safetyNotes: string[];
      requiresHumanReview: true;
      model: string;
      latencyMs: number;
      promptHash: string;
      provider?: 'ollama' | 'openai';
      dataTier?: string;
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

export type LocalAiCapabilitiesSnapshot = {
  operational: boolean;
  inferenceMode: 'ollama' | 'openai' | 'router';
  providers: {
    ollama: 'up' | 'down';
    openai: 'up' | 'down' | 'disabled';
  };
};

export async function fetchLocalAiCapabilities(
  baseUrl: string,
): Promise<LocalAiCapabilitiesSnapshot | null> {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/capabilities`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as LocalAiCapabilitiesSnapshot;
    return body;
  } catch {
    return null;
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

export type LocalAiTextboxAssistResult =
  | {
      status: 'success';
      resultText: string;
      requiresHumanReview: true;
      model?: string;
      latencyMs?: number;
    }
  | {
      status: 'unavailable' | 'rejected';
      message: string;
      requiresHumanReview: true;
    };

export async function requestTextboxAssist(
  baseUrl: string,
  body: AiTextboxAssistRequest,
): Promise<{ httpStatus: number; body: LocalAiTextboxAssistResult }> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/assist/textbox`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify(body),
  });
  const payload = (await res.json()) as LocalAiTextboxAssistResult;
  return { httpStatus: res.status, body: payload };
}
