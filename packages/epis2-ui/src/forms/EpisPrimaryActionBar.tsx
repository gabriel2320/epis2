import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useId, useState, type MouseEvent } from 'react';
import { EpisButton } from '../primitives/EpisButton.js';
import { epis2ClinicalFormFooterSx } from '../theme/m3-layout-tokens.js';

export type EpisPrimaryActionItem = {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  testId?: string;
  appearance?: 'filled' | 'outlined' | 'tonal' | 'text';
};

export type EpisPrimaryActionBarProps = {
  primary: EpisPrimaryActionItem;
  /** Máx. 2 secundarias visibles (PROG-AESTHETIC-RESET). */
  secondary?: EpisPrimaryActionItem[];
  /** Acciones en menú «Más». */
  overflow?: EpisPrimaryActionItem[];
  overflowLabel?: string;
  testId?: string;
};

const MAX_SECONDARY = 2;

/** MF-AEST-01 — una primaria · hasta 2 secundarias · resto en «Más». */
export function EpisPrimaryActionBar({
  primary,
  secondary = [],
  overflow = [],
  overflowLabel = 'Más',
  testId = 'epis2-primary-action-bar',
}: EpisPrimaryActionBarProps) {
  const menuId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);
  const visibleSecondary = secondary.slice(0, MAX_SECONDARY);
  const showOverflow = overflow.length > 0;

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Stack direction="row" sx={epis2ClinicalFormFooterSx} data-testid={testId}>
      <EpisButton
        appearance={primary.appearance ?? 'filled'}
        onClick={primary.onClick}
        {...(primary.disabled ? { disabled: true } : {})}
        {...(primary.testId ? { 'data-testid': primary.testId } : {})}
      >
        {primary.label}
      </EpisButton>
      {visibleSecondary.map((item) => (
        <EpisButton
          key={item.id}
          appearance={item.appearance ?? 'outlined'}
          onClick={item.onClick}
          {...(item.disabled ? { disabled: true } : {})}
          {...(item.testId ? { 'data-testid': item.testId } : {})}
        >
          {item.label}
        </EpisButton>
      ))}
      {showOverflow ? (
        <>
          <EpisButton
            appearance="text"
            onClick={openMenu}
            aria-controls={menuOpen ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            data-testid="epis2-primary-action-more"
          >
            {overflowLabel}
          </EpisButton>
          <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={closeMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            {overflow.map((item) => (
              <MenuItem
                key={item.id}
                {...(item.disabled ? { disabled: true } : {})}
                onClick={() => {
                  closeMenu();
                  item.onClick();
                }}
                {...(item.testId ? { 'data-testid': item.testId } : {})}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : null}
    </Stack>
  );
}
