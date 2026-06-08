import type {
  AiAssistDraftRequest,
  AiAssistDraftResponse,
  AiRunsListResponse,
  AiStatusResponse,
  AiSummarySuggestResponse,
  AiTextboxAssistRequest,
  AiTextboxAssistResponse,
  RagQueryResponse,
} from '@epis2/contracts';
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

export function requestTextboxAssist(
  body: AiTextboxAssistRequest,
): Promise<AiTextboxAssistResponse> {
  return apiFetch<AiTextboxAssistResponse>('/api/ai/assist/textbox', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchAiRuns(patientId?: string) {
  const q = patientId ? `?patientId=${encodeURIComponent(patientId)}&limit=10` : '?limit=10';
  return apiFetch<AiRunsListResponse>(`/api/ai/runs${q}`);
}

export function queryPatientRag(patientId: string, question: string) {
  return apiFetch<RagQueryResponse>('/api/ai/rag/query', {
    method: 'POST',
    body: JSON.stringify({ patientId, question }),
  });
}

export function suggestPatientSummary(patientId: string) {
  return apiFetch<AiSummarySuggestResponse>('/api/ai/suggest/summary', {
    method: 'POST',
    body: JSON.stringify({ patientId }),
  });
}
