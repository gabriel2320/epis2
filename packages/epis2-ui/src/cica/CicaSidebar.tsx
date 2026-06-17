import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
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
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { cicaShellPaddingXSx } from './cicaResponsive.js';
import { cicaTokens } from './cicaTokens.js';
import type { CicaSidebarItem, CicaSidebarSection } from './cicaSidebarNav.js';

const SIDEBAR_EXPANDED = 240;
const SIDEBAR_COLLAPSED = 56;

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

export type CicaSidebarProps = {
  sections: readonly CicaSidebarSection[];
  testId?: string;
};

/** Sidebar CICA — dos niveles (sistema + paciente), colapsable. */
export function CicaSidebar({ sections, testId = 'cica-sidebar' }: CicaSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <Box
      component="nav"
      aria-label="Navegación lateral CICA"
      data-testid={testId}
      data-cica-sidebar-collapsed={collapsed ? 'true' : 'false'}
      sx={{
        flexShrink: 0,
        width,
        minWidth: width,
        borderRight: 1,
        borderColor: cicaTokens.borderColor,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 180ms ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 0.5 : cicaShellPaddingXSx,
          py: 1,
          borderBottom: 1,
          borderColor: cicaTokens.borderColor,
          minHeight: cicaTokens.topBarHeight,
        }}
      >
        {!collapsed ? (
          <Typography variant="subtitle2" component="p" sx={{ fontWeight: 600, px: 1 }}>
            EPIS2
          </Typography>
        ) : null}
        <Tooltip title={collapsed ? 'Expandir menú' : 'Colapsar menú'}>
          <IconButton
            size="small"
            onClick={() => setCollapsed((v) => !v)}
            data-testid="cica-sidebar-toggle"
            aria-label={collapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
          >
            <MenuBookOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        {sections.map((section) => (
          <SidebarSection key={section.id} section={section} collapsed={collapsed} />
        ))}
      </Box>
    </Box>
  );
}

function SidebarSection({
  section,
  collapsed,
}: {
  section: CicaSidebarSection;
  collapsed: boolean;
}) {
  return (
    <Box sx={{ py: 1 }}>
      {!collapsed ? (
        <Typography
          variant="caption"
          component="p"
          color="text.secondary"
          sx={{ px: 2, pb: 0.5, textTransform: 'uppercase', letterSpacing: 0.4 }}
        >
          {section.title}
        </Typography>
      ) : null}
      <List dense disablePadding>
        {section.items.map((item) => (
          <SidebarItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </List>
    </Box>
  );
}

function SidebarItem({ item, collapsed }: { item: CicaSidebarItem; collapsed: boolean }) {
  const Icon = ICONS[item.id] ?? DescriptionOutlinedIcon;
  const disabled = Boolean(item.disabled || item.planned);

  const button = (
    <ListItemButton
      selected={Boolean(item.active)}
      disabled={disabled}
      onClick={item.onClick}
      data-testid={item.testId ?? `cica-sidebar-item-${item.id}`}
      sx={{
        mx: collapsed ? 0.5 : 1,
        borderRadius: 1,
        minHeight: 40,
        justifyContent: collapsed ? 'center' : 'flex-start',
        px: collapsed ? 0.5 : 1.5,
      }}
    >
      <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, justifyContent: 'center' }}>
        <Icon fontSize="small" />
      </ListItemIcon>
      {!collapsed ? (
        <ListItemText
          primary={item.label}
          secondary={item.planned ? 'Próximamente' : undefined}
          primaryTypographyProps={{ variant: 'body2', noWrap: true }}
          secondaryTypographyProps={{ variant: 'caption' }}
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
