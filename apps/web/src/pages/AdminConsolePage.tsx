import { copy } from '@epis2/design-system';
import { Alert, Button, Paper, Stack, Tab, Tabs, TextField, Typography } from '@epis2/epis2-ui';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  createAdminCatalogEntry,
  fetchAdminCatalogs,
  fetchAdminUsers,
  fetchAuditEvents,
  fetchOpsStatus,
  type AdminUserRow,
  type CatalogEntryRow,
} from '../api/adminApi.js';

export type AdminConsolePageProps = {
  initialTab?: 'users' | 'catalogs' | 'audit' | 'ops';
};

export function AdminConsolePage({ initialTab = 'users' }: AdminConsolePageProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [catalogs, setCatalogs] = useState<CatalogEntryRow[]>([]);
  const [auditEvents, setAuditEvents] = useState<Array<Record<string, unknown>>>([]);
  const [opsStatus, setOpsStatus] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [catalogCode, setCatalogCode] = useState('problem_type');
  const [entryCode, setEntryCode] = useState('');
  const [entryLabel, setEntryLabel] = useState('');

  useEffect(() => {
    setError(null);
    if (tab === 'users') {
      void fetchAdminUsers()
        .then((res) => setUsers(res.users))
        .catch(() => setError(copy.errors.genericMessage));
    }
    if (tab === 'catalogs') {
      void fetchAdminCatalogs()
        .then((res) => setCatalogs(res.entries))
        .catch(() => setError(copy.errors.genericMessage));
    }
    if (tab === 'audit') {
      void fetchAuditEvents(80)
        .then((res) => setAuditEvents(res.events))
        .catch(() => setError(copy.errors.genericMessage));
    }
    if (tab === 'ops') {
      void fetchOpsStatus()
        .then(setOpsStatus)
        .catch(() => setError(copy.errors.genericMessage));
    }
  }, [tab]);

  const onTabChange = (_: unknown, value: string) => {
    const next = value as AdminConsolePageProps['initialTab'];
    setTab(next ?? 'users');
    void navigate({ to: '/espacio/admin', search: { tab: next } });
  };

  const addCatalogEntry = async () => {
    if (!entryCode.trim() || !entryLabel.trim()) return;
    try {
      await createAdminCatalogEntry({
        catalogCode,
        entryCode: entryCode.trim(),
        label: entryLabel.trim(),
      });
      const res = await fetchAdminCatalogs();
      setCatalogs(res.entries);
      setEntryCode('');
      setEntryLabel('');
    } catch {
      setError(copy.errors.genericMessage);
    }
  };

  return (
    <Stack spacing={2} data-testid="epis2-admin-console">
      <Typography variant="h5">Consola de administración</Typography>
      <Alert severity="info">Vista demo read-only/staging — sin escritura en SoT clínico aprobado.</Alert>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Tabs value={tab} onChange={onTabChange}>
        <Tab label="Usuarios" value="users" data-testid="epis2-admin-tab-users" />
        <Tab label="Catálogos" value="catalogs" data-testid="epis2-admin-tab-catalogs" />
        <Tab label="Auditoría" value="audit" data-testid="epis2-admin-tab-audit" />
        <Tab label="Operaciones" value="ops" data-testid="epis2-admin-tab-ops" />
      </Tabs>

      {tab === 'users' ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          {users.map((u) => (
            <Typography key={u.id} variant="body2" sx={{ mb: 0.5 }}>
              {u.displayName} ({u.username}) — {u.role}
            </Typography>
          ))}
        </Paper>
      ) : null}

      {tab === 'catalogs' ? (
        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            {catalogs.map((c) => (
              <Typography key={c.id} variant="body2" sx={{ mb: 0.5 }}>
                {c.catalogCode}/{c.entryCode}: {c.label}
              </Typography>
            ))}
          </Paper>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField
                size="small"
                label="Catálogo"
                value={catalogCode}
                onChange={(e) => setCatalogCode(e.target.value)}
              />
              <TextField
                size="small"
                label="Código"
                value={entryCode}
                onChange={(e) => setEntryCode(e.target.value)}
              />
              <TextField
                size="small"
                label="Etiqueta"
                value={entryLabel}
                onChange={(e) => setEntryLabel(e.target.value)}
              />
              <Button variant="contained" onClick={() => void addCatalogEntry()}>
                Añadir staging
              </Button>
            </Stack>
          </Paper>
        </Stack>
      ) : null}

      {tab === 'audit' ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          {auditEvents.map((ev, idx) => (
            <Typography key={String(ev.id ?? idx)} variant="body2" sx={{ mb: 0.5 }}>
              {String(ev.eventType ?? 'event')} — {String(ev.message ?? '')}
            </Typography>
          ))}
        </Paper>
      ) : null}

      {tab === 'ops' ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {opsStatus ? JSON.stringify(opsStatus, null, 2) : '—'}
          </Typography>
        </Paper>
      ) : null}
    </Stack>
  );
}
