import type { ClinicalSpellIssue, LanguageToolAdapter } from './clinicalSpellcheck.js';
import { runLocalClinicalSpellcheck } from './clinicalSpellcheck.js';

type LanguageToolMatch = {
  offset: number;
  length: number;
  context?: { text?: string };
  replacements?: { value?: string }[];
};

type LanguageToolResponse = {
  matches?: LanguageToolMatch[];
};

function tokenFromMatch(text: string, match: LanguageToolMatch): string {
  return text.slice(match.offset, match.offset + match.length).trim();
}

function mapLanguageToolResponse(text: string, data: LanguageToolResponse, limit = 5): ClinicalSpellIssue[] {
  const matches = data.matches ?? [];
  return matches.slice(0, limit).map((match) => ({
    token: tokenFromMatch(text, match),
    suggestions: (match.replacements ?? [])
      .map((r) => r.value?.trim())
      .filter((v): v is string => Boolean(v))
      .slice(0, 3),
  }));
}

/** Adaptador HTTP LanguageTool self-hosted — sugiere, no autocorrige. */
export function createLanguageToolAdapter(
  checkUrl: string,
  language = 'es',
  fallbackToLocal = true,
): LanguageToolAdapter {
  return {
    async check(text) {
      try {
        const res = await fetch(checkUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ text, language }),
        });
        if (!res.ok) throw new Error(`LanguageTool ${res.status}`);
        const data = (await res.json()) as LanguageToolResponse;
        const mapped = mapLanguageToolResponse(text, data);
        return mapped.length > 0 ? mapped : fallbackToLocal ? runLocalClinicalSpellcheck(text) : [];
      } catch {
        return fallbackToLocal ? runLocalClinicalSpellcheck(text) : [];
      }
    },
  };
}

/** Adaptador vía API EPIS2 (proxy same-origin). */
export function createEpisSpellcheckAdapter(
  fetchJson: (text: string) => Promise<{ issues: ClinicalSpellIssue[] }>,
): LanguageToolAdapter {
  return {
    async check(text) {
      try {
        const data = await fetchJson(text);
        return data.issues.length > 0 ? data.issues : runLocalClinicalSpellcheck(text);
      } catch {
        return runLocalClinicalSpellcheck(text);
      }
    },
  };
}
