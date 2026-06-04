import type { AiAssistDraftRequest, AiAssistDraftResponse, AiStatusResponse } from '@epis2/contracts';
import { apiFetch } from './client.js';

export function fetchAiStatus(): Promise<AiStatusResponse> {
  return apiFetch<AiStatusResponse>('/api/ai/status');
}

export function requestDraftAssist(
  body: AiAssistDraftRequest,
): Promise<AiAssistDraftResponse> {
  return apiFetch<AiAssistDraftResponse>('/api/ai/assist/draft', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
