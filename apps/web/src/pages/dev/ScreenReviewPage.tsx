import { EPIS_CICA_SCREEN_REGISTRY, type CicaScreenDefinition } from '@epis2/epis2-ui';
import {
  Box,
  Divider,
  EpisButton,
  EpisCard,
  EpisChip,
  EpisM3Text,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useEffect, useMemo, useState } from 'react';

type ReviewStatus = 'pending' | 'fixing' | 'approved' | 'defer';
type ScreenMode = 'classic' | 'paper' | 'letter' | 'stub';
type ProductClass = 'core-read' | 'core-write' | 'paper' | 'stub-review';

type ScreenReviewRow = {
  id: string;
  route: string;
  previewRoute: string;
  paperRoute: string | null;
  intent: string;
  layoutProfile: string;
  mode: ScreenMode;
  productClass: ProductClass;
  navVisible: boolean;
  requiredSignals: readonly string[];
};

const STORAGE_KEY = 'epis2.screenReview.status';
const DEMO_PATIENT_ID = 'DEMO-005';
const DEMO_DATE = '2026-06-19';

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: 'Pendiente',
  fixing: 'Corrigiendo',
  approved: 'Aprobada',
  defer: 'Diferir',
};

function previewRoute(route: string): string {
  return route
    .replace(':patientId', DEMO_PATIENT_ID)
    .replace(':evolutionId', 'EV-DEMO')
    .replace(':date', DEMO_DATE);
}

function classifyMode(screen: CicaScreenDefinition): ScreenMode {
  if (screen.navVisible === false) return 'stub';
  if (screen.layoutProfile === 'paper-mode') return 'paper';
  if (screen.layoutProfile === 'letter-document' || screen.layoutProfile === 'book-reader') {
    return 'letter';
  }
  return 'classic';
}

function classifyProduct(screen: CicaScreenDefinition): ProductClass {
  const mode = classifyMode(screen);
  if (mode === 'stub') return 'stub-review';
  if (mode === 'paper') return 'paper';
  if (screen.id.startsWith('new-')) return 'core-write';
  return 'core-read';
}

function paperFollowRoute(screen: CicaScreenDefinition): string | null {
  if (!screen.route.includes(':patientId')) return null;
  if (screen.layoutProfile === 'paper-mode') return previewRoute(screen.route);
  return `/app/pacientes/${DEMO_PATIENT_ID}/papel/dia/${DEMO_DATE}`;
}

function buildRows(): ScreenReviewRow[] {
  return EPIS_CICA_SCREEN_REGISTRY.map((screen) => ({
    id: screen.id,
    route: screen.route,
    previewRoute: previewRoute(screen.route),
    paperRoute: paperFollowRoute(screen),
    intent: screen.intent,
    layoutProfile: screen.layoutProfile,
    mode: classifyMode(screen),
    productClass: classifyProduct(screen),
    navVisible: screen.navVisible !== false,
    requiredSignals: screen.requiredSignals ?? [],
  }));
}

function readStatuses(): Record<string, ReviewStatus> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ReviewStatus>) : {};
  } catch {
    return {};
  }
}

export function ScreenReviewPage() {
  const rows = useMemo(() => buildRows(), []);
  const [filter, setFilter] = useState<ProductClass | 'all'>('all');
  const [statuses, setStatuses] = useState<Record<string, ReviewStatus>>({});

  useEffect(() => {
    setStatuses(readStatuses());
  }, []);

  const visibleRows = rows.filter((row) => filter === 'all' || row.productClass === filter);
  const counts = rows.reduce<Record<ProductClass, number>>(
    (acc, row) => {
      acc[row.productClass] += 1;
      return acc;
    },
    { 'core-read': 0, 'core-write': 0, paper: 0, 'stub-review': 0 },
  );

  function setStatus(id: string, status: ReviewStatus) {
    const next = { ...statuses, [id]: status };
    setStatuses(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3, px: 2 }}>
      <Stack spacing={2.5} sx={{ maxWidth: 1180, mx: 'auto' }} data-testid="epis2-screen-review">
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1.5}>
          <Stack spacing={0.5}>
            <EpisM3Text role="headlineMedium">Revisión de pantallas EPIS2</EpisM3Text>
            <EpisM3Text role="bodyMedium" color="text.secondary">
              {rows.length} pantallas CICA · carta {DEMO_DATE} · paciente {DEMO_PATIENT_ID}
            </EpisM3Text>
          </Stack>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <EpisButton component="a" href="/app/buscar" appearance="outlined" size="small">
              Censo
            </EpisButton>
            <EpisButton component="a" href="/dev/chart-modes?chartMode=paper" size="small">
              Papel
            </EpisButton>
          </Stack>
        </Stack>

        <EpisCard sx={{ p: 2, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {(['all', 'core-read', 'core-write', 'paper', 'stub-review'] as const).map((value) => (
              <EpisButton
                key={value}
                appearance={filter === value ? 'filled' : 'outlined'}
                size="small"
                onClick={() => setFilter(value)}
              >
                {value === 'all' ? `Todas ${rows.length}` : `${value} ${counts[value]}`}
              </EpisButton>
            ))}
          </Stack>
        </EpisCard>

        <EpisCard sx={{ overflow: 'hidden', border: 1, borderColor: 'divider', boxShadow: 'none' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
              <Box component="thead" sx={{ bgcolor: 'background.default' }}>
                <Box component="tr">
                  {['Pantalla', 'Clase', 'Modo', 'Señales', 'Estado', 'Acciones'].map((head) => (
                    <Box
                      key={head}
                      component="th"
                      sx={{
                        p: 1.25,
                        textAlign: 'left',
                        borderBottom: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        {head}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {visibleRows.map((row) => {
                  const status = statuses[row.id] ?? 'pending';
                  return (
                    <Box key={row.id} component="tr">
                      <Box component="td" sx={{ p: 1.25, borderBottom: 1, borderColor: 'divider' }}>
                        <Stack spacing={0.25}>
                          <Typography variant="body2" fontWeight={700}>
                            {row.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.route}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.intent}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box component="td" sx={{ p: 1.25, borderBottom: 1, borderColor: 'divider' }}>
                        <EpisChip label={row.productClass} size="small" />
                      </Box>
                      <Box component="td" sx={{ p: 1.25, borderBottom: 1, borderColor: 'divider' }}>
                        <Stack spacing={0.5}>
                          <EpisChip label={row.mode} size="small" variant="outlined" />
                          <Typography variant="caption" color="text.secondary">
                            {row.layoutProfile}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box component="td" sx={{ p: 1.25, borderBottom: 1, borderColor: 'divider' }}>
                        <Stack direction="row" gap={0.5} flexWrap="wrap">
                          {row.requiredSignals.length === 0 ? (
                            <Typography variant="caption" color="text.secondary">
                              -
                            </Typography>
                          ) : (
                            row.requiredSignals.map((signal) => (
                              <EpisChip key={signal} label={signal} size="small" variant="outlined" />
                            ))
                          )}
                        </Stack>
                      </Box>
                      <Box component="td" sx={{ p: 1.25, borderBottom: 1, borderColor: 'divider' }}>
                        <Stack direction="row" gap={0.5} flexWrap="wrap">
                          {(Object.keys(STATUS_LABELS) as ReviewStatus[]).map((value) => (
                            <EpisButton
                              key={value}
                              appearance={status === value ? 'filled' : 'text'}
                              size="small"
                              onClick={() => setStatus(row.id, value)}
                            >
                              {STATUS_LABELS[value]}
                            </EpisButton>
                          ))}
                        </Stack>
                      </Box>
                      <Box component="td" sx={{ p: 1.25, borderBottom: 1, borderColor: 'divider' }}>
                        <Stack direction="row" gap={1} flexWrap="wrap">
                          <EpisButton component="a" href={row.previewRoute} size="small">
                            Abrir
                          </EpisButton>
                          {row.paperRoute ? (
                            <EpisButton
                              component="a"
                              href={row.paperRoute}
                              appearance="outlined"
                              size="small"
                            >
                              Carta
                            </EpisButton>
                          ) : null}
                        </Stack>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ p: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              SoT: EPIS_CICA_SCREEN_REGISTRY · estados locales en navegador
            </Typography>
          </Box>
        </EpisCard>
      </Stack>
    </Box>
  );
}
