import { copy } from '@epis2/design-system';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState, type MouseEvent } from 'react';
import { EpisButton } from '../primitives/EpisButton.js';
import { buildCicaPath, todayIsoDate } from './cicaRoutes.js';
import { cicaNavLabelMinPx, cicaShellPaddingXSx } from './cicaResponsive.js';
import { cicaTokens } from './cicaTokens.js';

const NAV_SHORT_LABELS: Record<string, string> = {
  search: 'Bus',
  census: 'Cen',
  chart: 'Fic',
  paper: 'Pap',
};

export type CicaNavItem = {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  testId?: string;
};

export type CicaClinicalNavProps = {
  items: readonly CicaNavItem[];
  moreItems?: readonly { id: string; label: string; onClick: () => void; testId?: string }[];
  moreLabel?: string;
  testId?: string;
};

/** Navegación clínica global — máx. 5 ítems visibles + Más. */
export function CicaClinicalNav({
  items,
  moreItems = [],
  moreLabel = 'Más',
  testId = 'cica-clinical-nav',
}: CicaClinicalNavProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const hideNavLabels = useMediaQuery(`(max-width:${cicaNavLabelMinPx - 1}px)`, { noSsr: true });
  const stackNav = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  return (
    <Box
      component="nav"
      aria-label="Navegación clínica CICA"
      data-testid={testId}
      sx={{
        flexShrink: 0,
        display: 'flex',
        alignItems: stackNav ? 'stretch' : 'center',
        gap: 0.5,
        px: cicaShellPaddingXSx,
        py: 0.75,
        borderBottom: 1,
        borderColor: cicaTokens.borderColor,
        bgcolor: 'background.default',
        flexWrap: 'wrap',
        minWidth: 0,
        overflowX: 'hidden',
      }}
    >
      {items.map((item) => (
        <NavButton key={item.id} item={item} hideLabel={hideNavLabels} />
      ))}
      {moreItems.length > 0 ? (
        <>
          <EpisButton
            appearance="text"
            size="small"
            data-testid="cica-nav-more"
            onClick={(e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}
          >
            {moreLabel}
          </EpisButton>
          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
            {moreItems.map((item) => (
              <MenuItem
                key={item.id}
                data-testid={item.testId ?? `cica-nav-more-${item.id}`}
                onClick={() => {
                  setAnchor(null);
                  item.onClick();
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : null}
    </Box>
  );
}

function NavButton({ item, hideLabel }: { item: CicaNavItem; hideLabel: boolean }) {
  const shortLabel = NAV_SHORT_LABELS[item.id];
  const displayLabel = hideLabel && shortLabel ? shortLabel : item.label;

  return (
    <EpisButton
      appearance={item.active ? 'tonal' : 'text'}
      size="small"
      disabled={Boolean(item.disabled)}
      data-testid={item.testId ?? `cica-nav-${item.id}`}
      aria-label={hideLabel ? item.label : undefined}
      sx={{ minWidth: 0, flexShrink: hideLabel ? 0 : undefined }}
      {...(item.onClick ? { onClick: item.onClick } : {})}
    >
      {displayLabel}
    </EpisButton>
  );
}

export type CicaNavBuilderContext = {
  pathname: string;
  patientId?: string | undefined;
  onNavigate: (to: string) => void;
};

/** Ítems canónicos Buscar · Censo · Ficha · Papel — rutas desde cicaRoutes. */
export function buildDefaultCicaNavItems(ctx: CicaNavBuilderContext): CicaNavItem[] {
  const { pathname, patientId, onNavigate } = ctx;
  const fichaPath = patientId ? buildCicaPath('patient-summary', { patientId }) : undefined;
  const paperPath = patientId
    ? buildCicaPath('paper-day', { patientId, date: todayIsoDate() })
    : undefined;

  return [
    {
      id: 'search',
      label: copy.clinicalNav.search,
      active: pathname === buildCicaPath('patient-search'),
      onClick: () => onNavigate(buildCicaPath('patient-search')),
    },
    {
      id: 'census',
      label: copy.clinicalNav.census,
      active: pathname === buildCicaPath('census'),
      onClick: () => onNavigate(buildCicaPath('census')),
    },
    {
      id: 'chart',
      label: copy.clinicalNav.ficha,
      active: pathname.includes('/app/pacientes/') && !pathname.includes('/papel/'),
      disabled: !patientId,
      ...(fichaPath ? { onClick: () => onNavigate(fichaPath) } : {}),
    },
    {
      id: 'paper',
      label: copy.clinicalNav.paper,
      active: pathname.includes('/papel/'),
      disabled: !patientId,
      ...(paperPath ? { onClick: () => onNavigate(paperPath) } : {}),
    },
  ];
}
