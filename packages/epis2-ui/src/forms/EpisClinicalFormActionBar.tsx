import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useId, useState, type MouseEvent } from 'react';
import Stack from '@mui/material/Stack';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisIconButton } from '../primitives/EpisIconButton.js';
import { epis2ClinicalFormFooterSx } from '../theme/m3-layout-tokens.js';

export type EpisClinicalFormActionBarOverflowItem = {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  testId?: string;
};

export type EpisClinicalFormActionBarProps = {
  saveLabel: string;
  onSave: () => void;
  saveDisabled?: boolean;
  signLabel?: string;
  onSign?: () => void;
  signDisabled?: boolean;
  overflow?: EpisClinicalFormActionBarOverflowItem[];
  overflowAriaLabel?: string;
};

/** UX-G03 — máx. 3 acciones visibles: Guardar · Firmar · ⋯ */
export function EpisClinicalFormActionBar({
  saveLabel,
  onSave,
  saveDisabled,
  signLabel,
  onSign,
  signDisabled,
  overflow = [],
  overflowAriaLabel = 'Más acciones',
}: EpisClinicalFormActionBarProps) {
  const menuId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);
  const showSign = Boolean(signLabel && onSign);
  const showOverflow = overflow.length > 0;

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row"
      sx={epis2ClinicalFormFooterSx}
      data-testid="epis2-clinical-form-action-bar"
    >
      <EpisButton
        appearance="filled"
        onClick={onSave}
        {...(saveDisabled ? { disabled: true } : {})}
        data-testid="epis2-form-save"
      >
        {saveLabel}
      </EpisButton>
      {showSign ? (
        <EpisButton
          appearance="outlined"
          onClick={onSign}
          {...(signDisabled ? { disabled: true } : {})}
          data-testid="epis2-form-sign"
        >
          {signLabel}
        </EpisButton>
      ) : null}
      {showOverflow ? (
        <>
          <EpisIconButton
            aria-label={overflowAriaLabel}
            aria-controls={menuOpen ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            onClick={openMenu}
            data-testid="epis2-form-more-actions"
          >
            <MoreVertIcon fontSize="small" />
          </EpisIconButton>
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
