import { copy } from '@epis2/design-system';

/** Sugerencias estáticas del command bar dashboard — acciones navegacionales, no clínicas irreversibles. */
export function dashboardCommandSuggestionLabels(): readonly string[] {
  return [
    copy.dashboardMd3.suggestShowCritical,
    copy.dashboardMd3.suggestShowPending,
    copy.dashboardMd3.suggestOpenPharmacy,
    copy.dashboardMd3.suggestOpenCommand,
  ];
}
