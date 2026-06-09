import type { CommandResolveResponse } from '@epis2/contracts';
import { DASHBOARD_TAB_BY_INTENT, type ClinicalIntent } from '@epis2/command-registry';
import { formSearchFromCommandSlots } from './commandFormSearch.js';
import { resolveModeRoute } from '../modes/episModeGuards.js';
import type { ClinicalFormRoutePath, ClinicalNavigateFn, DashboardTab } from '../routes/clinicalNavigate.js';

export function navigateClinicalCommandResult(
  navigate: ClinicalNavigateFn,
  result: Extract<CommandResolveResponse, { status: 'resolved' }>,
  patientId?: string,
): void {
  if (result.routePath === '/epis2/dashboard') {
    const tab =
      (DASHBOARD_TAB_BY_INTENT[result.intent as ClinicalIntent] ?? 'work') as DashboardTab;
    navigate(
      resolveModeRoute('dashboard', {
        dashboardTab: tab,
        ...(tab === 'patient' && patientId ? { patientId } : {}),
      }),
    );
    return;
  }

  navigate({
    to: result.routePath as ClinicalFormRoutePath,
    search: formSearchFromCommandSlots(patientId, result.slots),
  });
}
