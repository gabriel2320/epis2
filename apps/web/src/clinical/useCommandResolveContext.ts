import type { CommandActiveContext, CommandWorkspace } from '@epis2/command-registry';
import { useActivePatient } from './ActivePatientContext.js';
import { usePatientClinicalAlerts } from './usePatientClinicalAlerts.js';
import { useDraftsQuery } from '../query/hooks/useDraftsQuery.js';

/** Contexto operativo para ranking CE-1 (borradores, alertas, workspace). */
export function useCommandResolveContext(workspace: CommandWorkspace): CommandActiveContext {
  const { patient } = useActivePatient();
  const patientScoped = Boolean(patient?.id) || workspace === 'command_center';

  const draftsQuery = useDraftsQuery(
    patient?.id ? { patientId: patient.id } : undefined,
    patientScoped,
  );

  const { alerts } = usePatientClinicalAlerts({
    patientId: patient?.id,
  });

  const pendingDraftCount = (draftsQuery.data ?? []).length;
  const activeAlertCount = patient ? alerts.length : 0;

  const context: CommandActiveContext = { workspace };
  if (pendingDraftCount > 0) {
    context.pendingDraftCount = pendingDraftCount;
  }
  if (activeAlertCount > 0) {
    context.activeAlertCount = activeAlertCount;
  }
  return context;
}
