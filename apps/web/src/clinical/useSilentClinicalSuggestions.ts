import type { ClinicalAlert, PatientLongitudinalResponse } from '@epis2/contracts';
import {
  buildSilentClinicalSuggestions,
  SILENT_SUGGESTIONS_MAX_VISIBLE,
  type SilentClinicalSuggestion,
} from '@epis2/clinical-domain';
import { detectChronicFocus } from '@epis2/clinical-forms';
import { useMemo } from 'react';

export type UseSilentClinicalSuggestionsOptions = {
  alerts?: readonly ClinicalAlert[] | undefined;
  summaryFields?: Record<string, string> | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
};

export type UseSilentClinicalSuggestionsResult = {
  suggestions: SilentClinicalSuggestion[];
  maxVisible: number;
};

/** MF-DI-06 — deriva chips silenciosos desde alertas API + read models. */
export function useSilentClinicalSuggestions(
  options: UseSilentClinicalSuggestionsOptions,
): UseSilentClinicalSuggestionsResult {
  const chronicFocus = useMemo(() => {
    if (!options.summaryFields || Object.keys(options.summaryFields).length === 0) return null;
    return detectChronicFocus(options.summaryFields);
  }, [options.summaryFields]);

  const suggestions = useMemo(() => {
    const input: Parameters<typeof buildSilentClinicalSuggestions>[0] = { chronicFocus };
    if (options.alerts !== undefined) input.alerts = options.alerts;
    if (options.summaryFields !== undefined) input.summaryFields = options.summaryFields;
    if (options.longitudinal?.observations !== undefined) {
      input.observations = options.longitudinal.observations;
    }
    if (options.longitudinal?.allergies !== undefined) {
      input.allergies = options.longitudinal.allergies;
    }
    return buildSilentClinicalSuggestions(input);
  }, [options.alerts, options.summaryFields, options.longitudinal, chronicFocus]);

  return { suggestions, maxVisible: SILENT_SUGGESTIONS_MAX_VISIBLE };
}
