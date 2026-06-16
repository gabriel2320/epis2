import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useId, useState, type MouseEvent } from 'react';
import { EpisButton } from '../../primitives/EpisButton.js';
import type { ClinicalLayoutAction } from './clinicalLayoutEngine.js';

export type ClinicalOverflowMenuProps = {
  actions: readonly ClinicalLayoutAction[];
  label?: string;
};

/** Menú «Más» — acciones secundarias normalizadas por el layout engine. */
export function ClinicalOverflowMenu({
  actions,
  label = 'Más',
}: ClinicalOverflowMenuProps) {
  const menuId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  if (actions.length === 0) return null;

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <EpisButton
        appearance="text"
        onClick={handleOpen}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        data-testid="clinical-action-overflow"
      >
        {label}
      </EpisButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            {...(action.disabled ? { disabled: true } : {})}
            onClick={() => {
              handleClose();
              action.onClick();
            }}
            {...(action.testId ? { 'data-testid': action.testId } : {})}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
