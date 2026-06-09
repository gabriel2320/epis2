import { EpisAlert } from '@epis2/epis2-ui';
import type { ComponentProps } from 'react';
import { ClinicalAlertsPanel } from '../../components/ClinicalAlertsPanel.js';

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
};

/** Panel de alertas clínicas del formulario — solo con paciente + blueprint persistible. */
export function GeneratedFormClinicalAlerts({
  enabled,
  alerts,
  loading,
  label,
}: GeneratedFormClinicalAlertsProps) {
  if (!enabled) return null;
  return <ClinicalAlertsPanel alerts={alerts} loading={loading} hintBlueprintLabel={label} />;
}
