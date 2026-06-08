import type { AiTextboxAssistRequest, AiTextboxAssistResponse } from '@epis2/contracts';
import type { ClinicalTextboxAiAction } from '@epis2/clinical-productivity';
import { createEpisSpellcheckAdapter } from '@epis2/clinical-productivity';
import { apiFetch } from '../api/client.js';
import { requestTextboxAssist } from '../api/aiApi.js';

export const episClinicalSpellcheckAdapter = createEpisSpellcheckAdapter(async (text) =>
  apiFetch<{ issues: { token: string; suggestions: string[] }[] }>('/api/clinical/text-spellcheck', {
    method: 'POST',
    body: JSON.stringify({ text }),
  }),
);

export async function requestClinicalTextboxAiAssist(
  action: ClinicalTextboxAiAction,
  text: string,
  patientId?: string,
): Promise<string | null> {
  const payload: AiTextboxAssistRequest = { action, text, ...(patientId ? { patientId } : {}) };
  const response = await requestTextboxAssist(payload);
  if (response.status === 'success') return response.resultText;
  return null;
}

export type { AiTextboxAssistResponse };
