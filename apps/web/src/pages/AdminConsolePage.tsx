import { copy } from '@epis2/design-system';
import {
  EpisAlert,
  EpisButton,
  EpisM3Text,
  EpisTextField,
  EpisWorkspaceSection,
  Stack,
  Tab,
  Tabs,
} from '@epis2/epis2-ui';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BlueprintStudioPanel } from '../admin/BlueprintStudioPanel.js';
import {
  createAdminCatalogEntry,
  fetchAdminCatalogs,
  fetchAdminUsers,
  fetchAuditEvents,
  fetchOpsStatus,
  type AdminUserRow,
  type CatalogEntryRow,
} from '../api/adminApi.js';

export type AdminConsoleTab = 'users' | 'catalogs' | 'audit' | 'ops' | 'forms';

export type AdminConsolePageProps = {
  initialTab?: AdminConsoleTab;
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

  const onTabChange = (_: unknown, value: AdminConsoleTab) => {
    setTab(value);
    void navigate({ to: '/espacio/admin', search: { tab: value } });
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
      <EpisM3Text role="titleLarge" component="h1" sx={{ m: 0 }}>
        {copy.adminConsole.title}
      </EpisM3Text>
      <EpisAlert severity="info">{copy.adminConsole.demoDisclaimer}</EpisAlert>
      {error ? <EpisAlert severity="error">{error}</EpisAlert> : null}
      <Tabs value={tab} onChange={onTabChange}>
        <Tab label={copy.adminConsole.tabUsers} value="users" data-testid="epis2-admin-tab-users" />
        <Tab
          label={copy.adminConsole.tabCatalogs}
          value="catalogs"
          data-testid="epis2-admin-tab-catalogs"
        />
        <Tab label={copy.adminConsole.tabAudit} value="audit" data-testid="epis2-admin-tab-audit" />
        <Tab label={copy.adminConsole.tabOps} value="ops" data-testid="epis2-admin-tab-ops" />
        <Tab label={copy.adminConsole.tabForms} value="forms" data-testid="epis2-admin-tab-forms" />
      </Tabs>

      {tab === 'users' ? (
        <EpisWorkspaceSection title={copy.adminConsole.usersSection}>
          {users.map((u) => (
            <EpisM3Text key={u.id} role="bodyMedium" sx={{ mb: 0.5 }}>
              {u.displayName} ({u.username}) — {u.role}
            </EpisM3Text>
          ))}
        </EpisWorkspaceSection>
      ) : null}

      {tab === 'catalogs' ? (
        <Stack spacing={2}>
          <EpisWorkspaceSection title={copy.adminConsole.catalogsSection}>
            {catalogs.map((c) => (
              <EpisM3Text key={c.id} role="bodyMedium" sx={{ mb: 0.5 }}>
                {c.catalogCode}/{c.entryCode}: {c.label}
              </EpisM3Text>
            ))}
          </EpisWorkspaceSection>
          <EpisWorkspaceSection title={copy.adminConsole.catalogNewEntrySection}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <EpisTextField
                size="small"
                label={copy.adminConsole.catalogField}
                value={catalogCode}
                onChange={(e) => setCatalogCode(e.target.value)}
              />
              <EpisTextField
                size="small"
                label={copy.adminConsole.entryCodeField}
                value={entryCode}
                onChange={(e) => setEntryCode(e.target.value)}
              />
              <EpisTextField
                size="small"
                label={copy.adminConsole.entryLabelField}
                value={entryLabel}
                onChange={(e) => setEntryLabel(e.target.value)}
              />
              <EpisButton appearance="filled" onClick={() => void addCatalogEntry()}>
                {copy.adminConsole.addStaging}
              </EpisButton>
            </Stack>
          </EpisWorkspaceSection>
        </Stack>
      ) : null}

      {tab === 'audit' ? (
        <EpisWorkspaceSection title={copy.adminConsole.auditSection}>
          {auditEvents.map((ev, idx) => (
            <EpisM3Text key={String(ev.id ?? idx)} role="bodyMedium" sx={{ mb: 0.5 }}>
              {String(ev.eventType ?? 'event')} — {String(ev.message ?? '')}
            </EpisM3Text>
          ))}
        </EpisWorkspaceSection>
      ) : null}

      {tab === 'ops' ? (
        <EpisWorkspaceSection title={copy.adminConsole.opsSection}>
          <EpisM3Text role="bodyMedium" component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap' }}>
            {opsStatus ? JSON.stringify(opsStatus, null, 2) : '—'}
          </EpisM3Text>
        </EpisWorkspaceSection>
      ) : null}

      {tab === 'forms' ? <BlueprintStudioPanel /> : null}
    </Stack>
  );
}
