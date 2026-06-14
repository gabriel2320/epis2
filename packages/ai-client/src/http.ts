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

export type ApiFetch = <T>(path: string, init?: RequestInit) => Promise<T>;

/** Cliente HTTP IA — frontera web/API (MF-FF-11). */
export function createAiHttpClient(apiFetch: ApiFetch) {
  return {
    fetchAiStatus(): Promise<AiStatusResponse> {
      return apiFetch<AiStatusResponse>('/api/ai/status');
    },
    requestDraftAssist(body: AiAssistDraftRequest): Promise<AiAssistDraftResponse> {
      return apiFetch<AiAssistDraftResponse>('/api/ai/assist/draft', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    requestTextboxAssist(body: AiTextboxAssistRequest): Promise<AiTextboxAssistResponse> {
      return apiFetch<AiTextboxAssistResponse>('/api/ai/assist/textbox', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    fetchAiRuns(patientId?: string): Promise<AiRunsListResponse> {
      const q = patientId ? `?patientId=${encodeURIComponent(patientId)}&limit=10` : '?limit=10';
      return apiFetch<AiRunsListResponse>(`/api/ai/runs${q}`);
    },
    queryPatientRag(patientId: string, question: string): Promise<RagQueryResponse> {
      return apiFetch<RagQueryResponse>('/api/ai/rag/query', {
        method: 'POST',
        body: JSON.stringify({ patientId, question }),
      });
    },
    suggestPatientSummary(patientId: string): Promise<AiSummarySuggestResponse> {
      return apiFetch<AiSummarySuggestResponse>('/api/ai/suggest/summary', {
        method: 'POST',
        body: JSON.stringify({ patientId }),
      });
    },
  };
}

export type AiHttpClient = ReturnType<typeof createAiHttpClient>;
