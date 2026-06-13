import type { AiAssistCommandRouteRequest, AiAssistCommandRouteResponse } from '@epis2/contracts';
import { buildLocalAiRequestHeaders } from './localAiHeaders.js';

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
  apiKey?: string,
): Promise<{ httpStatus: number; body: CommandRouteAssistResult }> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/assist/command-route`, {
    method: 'POST',
    headers: buildLocalAiRequestHeaders(apiKey),
    signal: AbortSignal.timeout(12_000),
    body: JSON.stringify(body),
  });

  const payload = (await res.json()) as CommandRouteAssistResult;
  return { httpStatus: res.status, body: payload };
}
