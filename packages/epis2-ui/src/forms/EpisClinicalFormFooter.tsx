import type { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import {
  epis2ClinicalFormFooterSx,
  epis2M3Spacing,
} from '../theme/m3-layout-tokens.js';

export type EpisClinicalFormFooterProps = {
  /** Acciones primarias — alineadas a la derecha (MD3 cierre de formulario). */
  actions?: ReactNode;
  /** Contenido secundario bajo la fila de acciones (p. ej. navegación clínica). */
  trailing?: ReactNode;
};

/** Footer M3 — jerarquía filled + outlined/text, gap 8dp, alineación derecha. */
export function EpisClinicalFormFooter({ actions, trailing }: EpisClinicalFormFooterProps) {
  return (
    <Stack spacing={epis2M3Spacing.row} data-testid="epis2-clinical-form-footer">
      {actions ? (
        <Stack
          direction="row"
          sx={epis2ClinicalFormFooterSx}
          data-testid="epis2-clinical-form-footer-actions"
        >
          {actions}
        </Stack>
      ) : null}
      {trailing}
    </Stack>
  );
}
