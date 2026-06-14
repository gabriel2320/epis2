import { createAiHttpClient } from '@epis2/ai-client/http';
import { apiFetch } from './client.js';

const client = createAiHttpClient(apiFetch);

export const fetchAiStatus = client.fetchAiStatus;
export const requestDraftAssist = client.requestDraftAssist;
export const requestTextboxAssist = client.requestTextboxAssist;
export const fetchAiRuns = client.fetchAiRuns;
export const queryPatientRag = client.queryPatientRag;
export const suggestPatientSummary = client.suggestPatientSummary;
