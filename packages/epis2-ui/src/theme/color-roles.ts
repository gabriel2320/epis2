import type { PaletteOptions } from '@mui/material/styles';

export type Epis2Accent = 'clinicalBlue' | 'tealBlue' | 'calmGreen' | 'soberViolet' | 'neutral';

/** Presets de acento dinámico (solo primary/surface decorativa — no roles clínicos). */
export const accentPresets: Record<
  Epis2Accent,
  Pick<PaletteOptions, 'primary' | 'secondary'> & { surfaceTint?: string }
> = {
  clinicalBlue: {
    primary: { main: '#1873DC', light: '#E3F0FF', dark: '#0D5BB5', contrastText: '#FFFFFF' },
    secondary: { main: '#3D5166', light: '#EEF2F7', dark: '#243041', contrastText: '#FFFFFF' },
    surfaceTint: '#E3F0FF',
  },
  tealBlue: {
    primary: { main: '#0D7377', light: '#E0F4F5', dark: '#095456', contrastText: '#FFFFFF' },
    secondary: { main: '#546E7A', light: '#ECEFF1', dark: '#37474F', contrastText: '#FFFFFF' },
    surfaceTint: '#E0F4F5',
  },
  calmGreen: {
    primary: { main: '#2E7D52', light: '#E8F5EE', dark: '#1B5E3A', contrastText: '#FFFFFF' },
    secondary: { main: '#5F6B62', light: '#F0F4F1', dark: '#3D4A40', contrastText: '#FFFFFF' },
    surfaceTint: '#E8F5EE',
  },
  soberViolet: {
    primary: { main: '#5B4B8A', light: '#F0EDF8', dark: '#3D3260', contrastText: '#FFFFFF' },
    secondary: { main: '#6B6578', light: '#F3F1F6', dark: '#4A4556', contrastText: '#FFFFFF' },
    surfaceTint: '#F0EDF8',
  },
  neutral: {
    primary: { main: '#27272A', light: '#F4F4F5', dark: '#18181B', contrastText: '#FFFFFF' },
    secondary: { main: '#52525B', light: '#F4F4F5', dark: '#3F3F46', contrastText: '#FFFFFF' },
    surfaceTint: '#F4F4F5',
  },
};

export type M3SurfaceRoles = {
  surface: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
};

const lightSurfaces: M3SurfaceRoles = {
  surface: '#FFFFFF',
  surfaceContainer: '#F5F5F7',
  surfaceContainerHigh: '#EBEBED',
  onSurface: '#18181B',
  onSurfaceVariant: '#71717A',
  outline: '#E4E4E7',
  outlineVariant: '#F0F0F2',
};

/** warning/success/info — fijos; no provienen de MTB. */
export const epis2SemanticPalette = {
  warning: { main: '#D97706', light: '#FEF3C7', dark: '#92400E', contrastText: '#FFFFFF' },
  success: { main: '#059669', light: '#D1FAE5', dark: '#047857', contrastText: '#FFFFFF' },
  info: { main: '#0891B2', light: '#CFFAFE', dark: '#0E7490', contrastText: '#FFFFFF' },
} as const;

const darkSurfaces: M3SurfaceRoles = {
  surface: '#1C1C1E',
  surfaceContainer: '#141416',
  surfaceContainerHigh: '#2C2C2E',
  onSurface: '#FAFAFA',
  onSurfaceVariant: '#A1A1AA',
  outline: '#3F3F46',
  outlineVariant: '#27272A',
};

export function buildM3PaletteOptions(
  mode: 'light' | 'dark',
  accent: Epis2Accent,
): PaletteOptions {
  const preset = accentPresets[accent];
  const surfaces = mode === 'light' ? lightSurfaces : darkSurfaces;

  return {
    mode,
    primary: preset.primary!,
    secondary: preset.secondary!,
    background: {
      default: surfaces.surfaceContainer,
      paper: surfaces.surface,
    },
    text: {
      primary: surfaces.onSurface,
      secondary: surfaces.onSurfaceVariant,
    },
    divider: surfaces.outlineVariant,
    error: { main: '#B42318', light: '#FDECEC', dark: '#7A1C16', contrastText: '#FFFFFF' },
    warning: epis2SemanticPalette.warning,
    success: epis2SemanticPalette.success,
    info: epis2SemanticPalette.info,
  };
}

export { lightSurfaces, darkSurfaces };
