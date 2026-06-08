import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useId, useState, type MouseEvent, type ReactNode } from 'react';
import { EpisIconButton } from '../primitives/EpisIconButton.js';

export type EpisContextMenuItem = {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export type EpisContextMenuProps = {
  items: EpisContextMenuItem[];
  ariaLabel?: string;
  trigger?: ReactNode;
  testId?: string;
};

/** Menú contextual — acciones secundarias fuera de la ActionBar (RAD / MD3). */
export function EpisContextMenu({
  items,
  ariaLabel = 'Más acciones',
  trigger,
  testId = 'epis2-context-menu',
}: EpisContextMenuProps) {
  const menuId = useId();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  if (items.length === 0) return null;

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => setAnchor(null);

  return (
    <>
      {trigger ?? (
        <EpisIconButton
          aria-label={ariaLabel}
          aria-controls={open ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleOpen}
          data-testid={testId}
        >
          <MoreVertIcon fontSize="small" />
        </EpisIconButton>
      )}
      <Menu id={menuId} anchorEl={anchor} open={open} onClose={handleClose}>
        {items.map((item) => (
          <MenuItem
            key={item.id}
            {...(item.disabled ? { disabled: true } : {})}
            onClick={() => {
              handleClose();
              item.onClick();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
