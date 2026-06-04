import { copy } from '@epis2/design-system';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardWork } from '../api/dashboardApi.js';
import type { DashboardWorkResponse } from '@epis2/contracts';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { readRecentPatients } from '../clinical/recentPatients.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { DraftStatusChip } from '../components/DraftStatusChip.js';

type DashboardTab = 'work' | 'patient' | 'service';

export function DashboardModePage() {
  const search = useSearch({ strict: false }) as { tab?: string };
  const navigate = useClinicalNavigate();
  const { patient: activePatient, setPatient } = useActivePatient();
  const tab = (search.tab === 'patient' || search.tab === 'service' ? search.tab : 'work') as DashboardTab;

  const [work, setWork] = useState<DashboardWorkResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [recentPatients, setRecentPatients] = useState(readRecentPatients());

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetchDashboardWork();
      setWork(res);
      setRecentPatients(readRecentPatients());
    } catch {
      setError(copy.errors.genericMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'work') void load();
  }, [tab, load]);

  const setTab = (next: DashboardTab) => {
    void navigate({ to: '/epis2/dashboard', search: { tab: next } });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', px: 2, py: 3 }}>
      <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto' }} data-testid="epis2-dashboard-mode">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="h5" component="h1">
              {copy.dashboard.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {copy.dashboard.subtitle}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            data-testid="epis2-back-to-command"
            onClick={() => void navigate({ to: '/comando' })}
          >
            {copy.layout.backToCommand}
          </Button>
        </Stack>

        <Chip label={copy.demoBadge} size="small" color="warning" variant="outlined" sx={{ alignSelf: 'flex-start' }} />

        <Tabs value={tab} onChange={(_, v) => setTab(v as DashboardTab)} variant="scrollable">
          <Tab label={copy.dashboard.tabWork} value="work" data-testid="epis2-dashboard-tab-work" />
          <Tab label={copy.dashboard.tabPatient} value="patient" data-testid="epis2-dashboard-tab-patient" />
          <Tab label={copy.dashboard.tabService} value="service" data-testid="epis2-dashboard-tab-service" />
        </Tabs>

        {tab === 'patient' ? (
          <Alert severity="info">
            {activePatient
              ? `${copy.dashboard.tabPatient}: ${activePatient.displayName}`
              : copy.dashboard.tabPatientSoon}
          </Alert>
        ) : null}

        {tab === 'service' ? <Alert severity="info">{copy.dashboard.tabServiceSoon}</Alert> : null}

        {tab === 'work' ? (
          <>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {loading ? (
              <Typography color="text.secondary">{copy.dashboard.loading}</Typography>
            ) : (
              <Stack spacing={3}>
                <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-dashboard-my-drafts">
                  <Typography variant="subtitle2" gutterBottom>
                    {copy.dashboard.myOpenDrafts}
                  </Typography>
                  {work && work.myOpenDrafts.length > 0 ? (
                    <List dense disablePadding>
                      {work.myOpenDrafts.map((d) => (
                        <ListItem key={d.id} disablePadding>
                          <ListItemButton
                            onClick={() =>
                              void navigate({
                                to: '/espacio/borrador/$draftId',
                                params: { draftId: d.id },
                              })
                            }
                          >
                            <ListItemText
                              primary={d.title}
                              secondary={`${d.patientDisplayName} · ${d.draftType}`}
                            />
                            <DraftStatusChip status={d.status} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {copy.dashboard.emptyDrafts}
                    </Typography>
                  )}
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-dashboard-pending-review">
                  <Typography variant="subtitle2" gutterBottom>
                    {copy.dashboard.pendingReview}
                  </Typography>
                  {work && work.pendingReview.length > 0 ? (
                    <List dense disablePadding>
                      {work.pendingReview.map((d) => (
                        <ListItem key={d.id} disablePadding>
                          <ListItemButton
                            onClick={() =>
                              void navigate({
                                to: '/espacio/borrador/$draftId',
                                params: { draftId: d.id },
                              })
                            }
                          >
                            <ListItemText
                              primary={d.title}
                              secondary={d.patientDisplayName}
                            />
                            <DraftStatusChip status={d.status} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {copy.dashboard.emptyReview}
                    </Typography>
                  )}
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-dashboard-recent-patients">
                  <Typography variant="subtitle2" gutterBottom>
                    {copy.dashboard.recentPatients}
                  </Typography>
                  {recentPatients.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {recentPatients.map((p) => (
                        <Chip
                          key={p.id}
                          label={p.demoCaseCode ?? p.displayName}
                          clickable
                          variant={activePatient?.id === p.id ? 'filled' : 'outlined'}
                          onClick={() => {
                            setPatient(p);
                            void navigate({ to: '/comando' });
                          }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {copy.dashboard.emptyRecent}
                    </Typography>
                  )}
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-dashboard-demo-tasks">
                  <Typography variant="subtitle2" gutterBottom>
                    {copy.dashboard.demoTasks}
                  </Typography>
                  <Stack spacing={1}>
                    {work?.demoTasks.map((task) => (
                      <Stack key={task.id} direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {task.label}
                        </Typography>
                        <Button
                          size="small"
                          variant="text"
                          disabled={task.disabled}
                          onClick={() => void navigate({ to: '/comando' })}
                        >
                          {copy.dashboard.useCommand}
                        </Button>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            )}
          </>
        ) : null}

        <Divider />
        <Button variant="text" onClick={() => void navigate({ to: '/comando' })}>
          {copy.layout.backToCommand}
        </Button>
      </Stack>
    </Box>
  );
}
