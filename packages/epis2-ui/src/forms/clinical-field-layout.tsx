import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import Stack from '@mui/material/Stack';
import { epis2BarLayout } from '../theme/breakpoints.js';
import { epis2M3Spacing, epis2M3TouchTargetMinPx } from '../theme/m3-layout-tokens.js';
import { epis2IslandPaddingSx, epis2IslandSx } from '../theme/island-layout.js';
import { epis2LineHeight, epis2ProseMaxWidth } from '../theme/typography-rules.js';

export const CLINICAL_TEXTAREA_ROWS = 4;

/** Altura fija del área de texto multilínea — evita crecimiento al escribir. */
export const clinicalTextareaMinHeight = CLINICAL_TEXTAREA_ROWS * 20 + 20;

export type EpisClinicalFieldLabelProps = {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
};

export function EpisClinicalFieldLabel({ htmlFor, required, children }: EpisClinicalFieldLabelProps) {
  return (
    <EpisM3Text
      role="labelLarge"
      component="label"
      {...(htmlFor ? { htmlFor } : {})}
      sx={{ display: 'block', color: 'text.primary', px: 1, pb: 0.25 }}
    >
      {children}
      {required ? ' *' : ''}
    </EpisM3Text>
  );
}

/** Sin muesca de label MUI — evita manchas blancas en el borde del campo. */
export const clinicalOutlinedInputSlotProps = {
  input: { notched: false },
} as const;

const stableOutlineSx = {
  transition: 'none',
  borderWidth: '2px !important',
};

/** Isla blanca para formularios clínicos (patrón M3 escritorio). */
export const epis2ClinicalFormCanvasSx: SystemStyleObject<Theme> = {
  ...epis2IslandSx,
  ...epis2IslandPaddingSx,
  width: '100%',
  maxWidth: epis2BarLayout.clinicalFormMaxWidth,
  mx: 'auto',
  boxSizing: 'border-box',
};

/** Contenedor centrado dentro de two-pane / scrollspy — mismo encuadre que canvas. */
export const epis2ClinicalFormContentMaxWidthSx: SystemStyleObject<Theme> = {
  width: '100%',
  maxWidth: epis2BarLayout.clinicalFormMaxWidth,
  mx: 'auto',
  boxSizing: 'border-box',
};

const clinicalInputPaddingSx = {
  px: 2,
  py: 1.5,
};

export function clinicalFieldShellSx(multiline?: boolean): SxProps<Theme> {
  return {
    width: '100%',
    contain: 'layout style',
    minHeight: multiline ? clinicalTextareaMinHeight + 48 : 80,
    '& .MuiOutlinedInput-root': {
      transition: 'none',
      backgroundColor: 'transparent',
      '&:hover .MuiOutlinedInput-notchedOutline': stableOutlineSx,
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': stableOutlineSx,
      '&.Mui-error .MuiOutlinedInput-notchedOutline': stableOutlineSx,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      ...stableOutlineSx,
      '& legend': {
        display: 'none !important',
        transition: 'none',
        width: 0,
        maxWidth: 0,
        padding: 0,
      },
    },
    '& .MuiOutlinedInput-input, & .MuiSelect-select': {
      ...clinicalInputPaddingSx,
      transition: 'none',
    },
    '& .MuiFormHelperText-root': {
      minHeight: '1.375rem',
      marginTop: '8px',
      px: 1,
      fontSize: '0.875rem',
      lineHeight: 1.55,
    },
    ...(multiline
      ? {
          '& .MuiInputBase-root': {
            height: clinicalTextareaMinHeight + 16,
            minHeight: clinicalTextareaMinHeight + 16,
            maxHeight: clinicalTextareaMinHeight + 16,
            alignItems: 'flex-start',
            boxSizing: 'border-box',
          },
          '& textarea.MuiInputBase-input': {
            height: `${clinicalTextareaMinHeight}px !important`,
            minHeight: `${clinicalTextareaMinHeight}px !important`,
            maxHeight: `${clinicalTextareaMinHeight}px !important`,
            overflow: 'auto !important',
            resize: 'none',
            boxSizing: 'border-box',
          },
        }
      : {
          '& .MuiInputBase-root': {
            minHeight: epis2M3TouchTargetMinPx,
          },
        }),
  };
}

export function ClinicalFieldStack({
  label,
  htmlFor,
  required,
  multiline,
  clinicalProse,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  multiline?: boolean;
  clinicalProse?: boolean;
  children: ReactNode;
}) {
  return (
    <Stack
      spacing={epis2M3Spacing.tight}
      sx={{
        ...clinicalFieldShellSx(multiline),
        ...(clinicalProse && multiline
          ? {
              maxWidth: epis2ProseMaxWidth,
              lineHeight: epis2LineHeight.body,
              textAlign: 'left',
            }
          : {}),
      }}
    >
      <EpisClinicalFieldLabel
        {...(htmlFor ? { htmlFor } : {})}
        {...(required ? { required: true } : {})}
      >
        {label}
      </EpisClinicalFieldLabel>
      {children}
    </Stack>
  );
}
