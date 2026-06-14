import type { OperationalCatalogUsage } from '@epis2/contracts';
import { filterClinicalCommandAutocomplete } from '@epis2/command-registry';
import { useMemo } from 'react';
import { EPIS_COMMAND_BAR_MAX_SUGGESTIONS } from '../quality/uiDensityRules.js';

/** Sugerencias de autocompletar desde diccionario clínico (PROG-AUTO-DEV-6H + MF-DI-03). */
export function useCommandDictionarySuggestions(
  query: string,
  options?: {
    patientId?: string | undefined;
    catalogUsage?: OperationalCatalogUsage | undefined;
  },
): readonly string[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    return filterClinicalCommandAutocomplete(trimmed, {
      ...(options?.patientId ? { requiresPatient: true } : {}),
      limit: EPIS_COMMAND_BAR_MAX_SUGGESTIONS,
      personalLabUsage: options?.catalogUsage?.laboratory,
      personalDiagnosisUsage: options?.catalogUsage?.diagnosis,
    });
  }, [query, options?.patientId, options?.catalogUsage]);
}
