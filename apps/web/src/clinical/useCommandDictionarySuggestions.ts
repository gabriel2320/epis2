import { filterClinicalCommandAutocomplete } from '@epis2/command-registry';
import { useMemo } from 'react';
import { EPIS_COMMAND_BAR_MAX_SUGGESTIONS } from '../quality/uiDensityRules.js';

/** Sugerencias de autocompletar desde diccionario clínico (PROG-AUTO-DEV-6H). */
export function useCommandDictionarySuggestions(
  query: string,
  options?: { patientId?: string | undefined },
): readonly string[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    return filterClinicalCommandAutocomplete(trimmed, {
      ...(options?.patientId ? { requiresPatient: true } : {}),
      limit: EPIS_COMMAND_BAR_MAX_SUGGESTIONS,
    });
  }, [query, options?.patientId]);
}
