import { EpisAlert } from '@epis2/epis2-ui';
import type { PostSaveMicrojourneyAction } from '@epis2/clinical-productivity';
import type { ComponentProps } from 'react';
import { ClinicalAlertsPanel } from '../../components/ClinicalAlertsPanel.js';
import { ClinicalOrderSelectCdsPanel } from '../../pages/prescription/ClinicalOrderSelectCdsPanel.js';
import { PostSaveMicrojourneyPanel } from './PostSaveMicrojourneyPanel.js';

/** Alerta de estado del formulario generado (guardado / info). */
export function GeneratedFormStatusAlert({ message }: { message: string | undefined }) {
  if (!message) return null;
  return (
    <EpisAlert
      severity={message.includes('guardado') ? 'success' : 'info'}
      data-testid="epis2-form-status"
    >
      {message}
    </EpisAlert>
  );
}

type GeneratedFormClinicalAlertsProps = {
  enabled: boolean;
  alerts: ComponentProps<typeof ClinicalAlertsPanel>['alerts'];
  loading: boolean;
  label: string;
  blueprintId?: string | undefined;
};

/** Panel de alertas clínicas del formulario — solo con paciente + blueprint persistible. */
export function GeneratedFormClinicalAlerts({
  enabled,
  alerts,
  loading,
  label,
  blueprintId,
}: GeneratedFormClinicalAlertsProps) {
  if (!enabled) return null;

  if (blueprintId === 'prescription') {
    if (loading) return null;
    if (alerts.length === 0) return null;
    return <ClinicalOrderSelectCdsPanel alerts={alerts} />;
  }

  return <ClinicalAlertsPanel alerts={alerts} loading={loading} hintBlueprintLabel={label} />;
}

export function GeneratedFormPostSaveMicrojourneys({
  actions,
  onDismiss,
}: {
  actions: readonly PostSaveMicrojourneyAction[];
  onDismiss?: (() => void) | undefined;
}) {
  return <PostSaveMicrojourneyPanel actions={actions} onDismiss={onDismiss} />;
}
