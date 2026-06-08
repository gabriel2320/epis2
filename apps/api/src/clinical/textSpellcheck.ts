import {
  clinicalTextSpellcheckRequestSchema,
  clinicalTextSpellcheckResponseSchema,
} from '@epis2/contracts';
import {
  createLanguageToolAdapter,
  runClinicalSpellcheck,
  simulatedLanguageToolAdapter,
} from '@epis2/clinical-productivity';
import type { AppConfig } from '../config.js';

export async function runClinicalTextSpellcheck(config: AppConfig, text: string) {
  const adapter = config.LANGUAGETOOL_BASE_URL
    ? createLanguageToolAdapter(
        `${config.LANGUAGETOOL_BASE_URL.replace(/\/$/, '')}/v2/check`,
        'es',
      )
    : simulatedLanguageToolAdapter;
  const issues = await runClinicalSpellcheck(text, adapter);
  return clinicalTextSpellcheckResponseSchema.parse({ issues });
}

export function parseClinicalTextSpellcheckRequest(body: unknown) {
  return clinicalTextSpellcheckRequestSchema.safeParse(body);
}
