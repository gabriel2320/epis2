import type { AiAssistCommandRouteRequest, AiAssistCommandRouteResponse } from '@epis2/contracts';

export type CommandRouteAssistResult =
  | Extract<AiAssistCommandRouteResponse, { status: 'success' }>
  | {
      status: 'unavailable' | 'rejected';
      message: string;
      promptHash?: string;
      model?: string;
      latencyMs?: number;
    };

export async function requestCommandRouteAssist(
  baseUrl: string,
  body: AiAssistCommandRouteRequest,
): Promise<{ httpStatus: number; body: CommandRouteAssistResult }> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/assist/command-route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(12_000),
    body: JSON.stringify(body),
  });

  const payload = (await res.json()) as CommandRouteAssistResult;
  return { httpStatus: res.status, body: payload };
}
