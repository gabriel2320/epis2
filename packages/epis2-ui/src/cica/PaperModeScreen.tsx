import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import {
  cicaPaperCanvasSx,
  cicaPaperModeContentSx,
  cicaPaperModeToolbarSx,
} from './cicaResponsive.js';

export type PaperModeScreenProps = {
  toolbar?: ReactNode;
  children: ReactNode;
  testId?: string;
};

/** Pantalla exclusiva modo papel — fullscreen, sin sidebar. */
export function PaperModeScreen({
  toolbar,
  children,
  testId = 'cica-paper-mode-screen',
}: PaperModeScreenProps) {
  return (
    <Box
      data-testid={testId}
      data-cica-paper-standalone="true"
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {toolbar}
      <Box sx={cicaPaperModeContentSx()}>{children}</Box>
    </Box>
  );
}

export type PaperModeToolbarProps = {
  children: ReactNode;
  testId?: string;
};

export function PaperModeToolbar({
  children,
  testId = 'cica-paper-toolbar',
}: PaperModeToolbarProps) {
  return (
    <Box data-testid={testId} sx={cicaPaperModeToolbarSx()}>
      {children}
    </Box>
  );
}

export type PaperCanvasProps = {
  children: ReactNode;
  watermark?: string | undefined;
  testId?: string;
};

export function PaperCanvas({
  children,
  watermark,
  testId = 'cica-paper-canvas',
}: PaperCanvasProps) {
  return (
    <Box data-testid={testId} sx={cicaPaperCanvasSx()}>
      {watermark ? (
        <Box
          aria-hidden
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: theme.palette.mode === 'dark' ? 0.035 : 0.06,
            color: 'text.disabled',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            letterSpacing: 4,
            '@media print': {
              opacity: 0.08,
            },
          })}
        >
          {watermark}
        </Box>
      ) : null}
      {children}
    </Box>
  );
}
