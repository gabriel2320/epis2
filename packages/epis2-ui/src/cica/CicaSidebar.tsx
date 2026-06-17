import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { cicaEpis2gVisual, resolveCicaEpis2gSurfaces } from './cicaEpis2gVisual.js';
import { CicaSidebarThemePanel } from './CicaSidebarThemePanel.js';
import type { CicaSidebarItem, CicaSidebarSection } from './cicaSidebarNav.js';
import { useCicaThemeTokens } from './useCicaThemeTokens.js';

const ICONS: Record<string, typeof SearchOutlinedIcon> = {
  search: SearchOutlinedIcon,
  census: PeopleOutlineIcon,
  recent: HistoryOutlinedIcon,
  'my-work': WorkOutlineIcon,
  agenda: CalendarMonthOutlinedIcon,
  resumen: SummarizeOutlinedIcon,
  evoluciones: NotesOutlinedIcon,
  indicaciones: DescriptionOutlinedIcon,
  examenes: ScienceOutlinedIcon,
  documentos: DescriptionOutlinedIcon,
  papel: MenuBookOutlinedIcon,
  'evolution-book': MenuBookOutlinedIcon,
  'paper-book': MenuBookOutlinedIcon,
  ingreso: ImportContactsOutlinedIcon,
  medicamentos: MedicationOutlinedIcon,
  interconsultas: SwapHorizOutlinedIcon,
  procedimientos: MedicalServicesOutlinedIcon,
  alta: ExitToAppOutlinedIcon,
  timeline: TimelineOutlinedIcon,
  auditoria: ShieldOutlinedIcon,
  appearance: PaletteOutlinedIcon,
};

export type CicaSidebarPatientContext = {
  displayName: string;
  bedLabel?: string;
  onClosePatient?: () => void;
};

export type CicaSidebarProps = {
  sections: readonly CicaSidebarSection[];
  patientContext?: CicaSidebarPatientContext;
  themeControls?: ReactNode;
  testId?: string;
};

/** Sidebar dual epis2g — rail oscuro L1 + panel paciente L2. */
export function CicaSidebar({
  sections,
  patientContext,
  themeControls,
  testId = 'cica-sidebar',
}: CicaSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark } = useCicaThemeTokens();
  const surfaces = resolveCicaEpis2gSurfaces(isDark);

  const systemSection = sections.find((s) => s.id === 'system');
  const patientSection = sections.find((s) => s.id === 'patient');
  const toolsSection = sections.find((s) => s.id === 'tools');

  const railWidth = collapsed
    ? cicaEpis2gVisual.railWidthCollapsed
    : cicaEpis2gVisual.railWidthExpanded;

  return (
    <Box
      component="nav"
      id="cica-dual-sidebar-shell"
      aria-label="Navegación lateral CICA"
      data-testid={testId}
      data-cica-sidebar-collapsed={collapsed ? 'true' : 'false'}
      data-cica-visual="epis2g"
      sx={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'row',
        borderRight: 1,
        borderColor: surfaces.panelBorder,
        bgcolor: surfaces.panelBg,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* L1 — rail sistema (epis2g slate-900) */}
      <Box
        data-testid="cica-sidebar-rail-l1"
        sx={{
          width: railWidth,
          minWidth: railWidth,
          bgcolor: cicaEpis2gVisual.railBg,
          color: cicaEpis2gVisual.railText,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 150ms ease',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            px: collapsed ? 0.5 : 2,
            py: 2,
            borderBottom: 1,
            borderColor: cicaEpis2gVisual.railBorder,
          }}
        >
          {!collapsed ? (
            <Box
              component="span"
              sx={{
                fontFamily: cicaEpis2gVisual.fontMono,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: cicaEpis2gVisual.brandBadgeText,
                bgcolor: cicaEpis2gVisual.brandBadgeBg,
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                boxShadow: 1,
              }}
            >
              EPIS2 CICA
            </Box>
          ) : null}
          <Tooltip title={collapsed ? 'Expandir menú' : 'Colapsar menú'}>
            <IconButton
              size="small"
              onClick={() => setCollapsed((v) => !v)}
              data-testid="cica-sidebar-toggle"
              aria-label={collapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
              sx={{
                color: cicaEpis2gVisual.railTextMuted,
                bgcolor: cicaEpis2gVisual.railHoverBg,
                '&:hover': { bgcolor: '#334155', color: '#fff' },
              }}
            >
              {collapsed ? (
                <ChevronRightOutlinedIcon sx={{ fontSize: 14 }} />
              ) : (
                <ChevronLeftOutlinedIcon sx={{ fontSize: 14 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 1 }}>
          <List dense disablePadding>
            {(systemSection?.items ?? []).map((item) => (
              <RailItem key={item.id} item={item} collapsed={collapsed} />
            ))}
          </List>
        </Box>

        <Box
          sx={{
            borderTop: 1,
            borderColor: cicaEpis2gVisual.railBorder,
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {themeControls ?? <CicaSidebarThemePanel collapsed={collapsed} />}
          {(toolsSection?.items ?? []).map((item) => (
            <RailItem key={item.id} item={item} collapsed={collapsed} compact />
          ))}
          <Typography
            variant="caption"
            sx={{
              color: cicaEpis2gVisual.railTextMuted,
              fontFamily: cicaEpis2gVisual.fontMono,
              fontSize: 10,
            }}
          >
            {collapsed ? 'V1' : '© 2026 EPIS2 V1'}
          </Typography>
        </Box>
      </Box>

      {/* L2 — panel paciente */}
      {patientSection && patientContext ? (
        <Box
          data-testid="cica-sidebar-rail-l2"
          sx={{
            width: cicaEpis2gVisual.patientPanelWidth,
            minWidth: cicaEpis2gVisual.patientPanelWidth,
            bgcolor: surfaces.panelBg,
            borderLeft: 1,
            borderColor: surfaces.panelBorder,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 2,
              borderBottom: 1,
              borderColor: surfaces.panelBorder,
              bgcolor: surfaces.panelHeaderBg,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: cicaEpis2gVisual.fontMono,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: surfaces.accentLabel,
                display: 'block',
              }}
            >
              Ficha del paciente
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              noWrap
              title={patientContext.displayName}
              sx={{ mt: 0.75, color: 'text.primary' }}
            >
              {patientContext.displayName}
            </Typography>
            {patientContext.bedLabel ? (
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  fontFamily: cicaEpis2gVisual.fontMono,
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: cicaEpis2gVisual.statusDot,
                    flexShrink: 0,
                  }}
                />
                Cama: {patientContext.bedLabel}
              </Typography>
            ) : null}
          </Box>

          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 1 }}>
            <List dense disablePadding>
              {patientSection.items.map((item) => (
                <PatientPanelItem key={item.id} item={item} surfaces={surfaces} />
              ))}
            </List>
          </Box>

          {patientContext.onClosePatient ? (
            <Box
              sx={{
                p: 1.5,
                borderTop: 1,
                borderColor: surfaces.panelBorder,
                bgcolor: surfaces.panelHeaderBg,
              }}
            >
              <Button
                fullWidth
                size="small"
                variant="contained"
                onClick={patientContext.onClosePatient}
                data-testid="cica-sidebar-close-patient"
                sx={{
                  bgcolor: cicaEpis2gVisual.railBg,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontSize: 11,
                  fontWeight: 600,
                  '&:hover': { bgcolor: cicaEpis2gVisual.railHoverBg },
                }}
              >
                Cerrar ficha
              </Button>
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}

function RailItem({
  item,
  collapsed,
  compact = false,
}: {
  item: CicaSidebarItem;
  collapsed: boolean;
  compact?: boolean;
}) {
  const Icon = ICONS[item.id] ?? DescriptionOutlinedIcon;
  const disabled = Boolean(item.disabled || item.planned);
  const selected = Boolean(item.active);

  const button = (
    <ListItemButton
      selected={selected}
      disabled={disabled}
      onClick={item.onClick}
      data-testid={item.testId ?? `cica-sidebar-item-${item.id}`}
      sx={{
        borderRadius: 1,
        mb: compact ? 0.5 : 0.25,
        minHeight: compact ? 36 : 40,
        justifyContent: collapsed ? 'center' : 'flex-start',
        px: collapsed ? 0.5 : 1.25,
        py: compact ? 0.75 : 1,
        color: selected ? cicaEpis2gVisual.railSelectedText : cicaEpis2gVisual.railText,
        bgcolor: selected ? cicaEpis2gVisual.railSelectedBg : 'transparent',
        '&:hover': {
          bgcolor: selected ? cicaEpis2gVisual.railSelectedBg : cicaEpis2gVisual.railHoverBg,
          color: '#fff',
        },
        '&.Mui-selected': {
          bgcolor: cicaEpis2gVisual.railSelectedBg,
          color: cicaEpis2gVisual.railSelectedText,
          '&:hover': { bgcolor: cicaEpis2gVisual.railSelectedBg },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 0 : 32,
          justifyContent: 'center',
          color: 'inherit',
        }}
      >
        <Icon sx={{ fontSize: 16 }} />
      </ListItemIcon>
      {!collapsed ? (
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            variant: 'body2',
            noWrap: true,
            fontSize: 12,
            fontWeight: selected ? 600 : 400,
          }}
        />
      ) : null}
    </ListItemButton>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.planned ? `${item.label} (próximamente)` : item.label} placement="right">
        {button}
      </Tooltip>
    );
  }

  return button;
}

function PatientPanelItem({
  item,
  surfaces,
}: {
  item: CicaSidebarItem;
  surfaces: ReturnType<typeof resolveCicaEpis2gSurfaces>;
}) {
  const Icon = ICONS[item.id] ?? DescriptionOutlinedIcon;
  const selected = Boolean(item.active);

  return (
    <ListItemButton
      selected={selected}
      onClick={item.onClick}
      data-testid={item.testId ?? `cica-sidebar-patient-${item.id}`}
      sx={{
        borderRadius: 1,
        mb: 0.25,
        minHeight: 36,
        pl: 1.5,
        pr: 1,
        borderLeft: selected ? 2 : 0,
        borderColor: cicaEpis2gVisual.panelSelectedAccent,
        bgcolor: selected ? surfaces.panelSelectedBg : 'transparent',
        color: selected ? surfaces.accentLabel : 'text.secondary',
        '&:hover': {
          bgcolor: surfaces.panelSelectedBg,
          color: 'text.primary',
        },
        '&.Mui-selected': {
          bgcolor: surfaces.panelSelectedBg,
          color: surfaces.accentLabel,
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
        <Icon sx={{ fontSize: 14 }} />
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{ variant: 'body2', noWrap: true, fontSize: 12, fontWeight: 500 }}
      />
    </ListItemButton>
  );
}
