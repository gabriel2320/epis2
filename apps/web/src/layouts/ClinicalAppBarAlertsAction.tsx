import { copy } from '@epis2/design-system';
import { Drawer, EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { useState } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';

/** Panel de alertas clínicas desde la AppBar (UX-A.3). */
export function ClinicalAppBarAlertsAction() {
  const { patient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const [open, setOpen] = useState(false);
  const { alerts, loading } = usePatientClinicalAlerts({
    patientId: patient?.id,
    enabled: Boolean(patient?.id),
  });

  const alertCount = alerts.length;

  const handleOpen = () => {
    if (!patient?.id) {
      void navigate({ to: '/espacio/buscar-paciente' });
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <EpisButton
        appearance="text"
        size="small"
        data-testid="epis2-nav-alertas"
        onClick={handleOpen}
      >
        {copy.layout.navAlerts}
        {alertCount > 0 ? ` (${alertCount})` : ''}
      </EpisButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        data-testid="epis2-nav-alertas-drawer"
      >
        <Stack spacing={2} sx={{ width: { xs: '100vw', sm: 400 }, maxWidth: '100vw', p: 2 }}>
          <Typography variant="subtitle1">{copy.layout.navAlerts}</Typography>
          {patient ? (
            <Typography variant="body2" color="text.secondary">
              {patient.displayName}
              {patient.demoCaseCode ? ` · ${patient.demoCaseCode}` : ''}
            </Typography>
          ) : null}
          <ClinicalAlertsPanel alerts={alerts} loading={loading} />
          <EpisButton
            appearance="text"
            size="small"
            onClick={() => {
              setOpen(false);
              if (patient?.id) {
                void navigate({ to: '/espacio/ficha', search: { patientId: patient.id } });
              }
            }}
          >
            {copy.activePatient.workspace}
          </EpisButton>
        </Stack>
      </Drawer>
    </>
  );
}
