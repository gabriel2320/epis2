import type { PaletteOptions } from '@mui/material/styles';

export type Epis2Accent = 'clinicalBlue' | 'tealBlue' | 'calmGreen' | 'soberViolet' | 'neutral';

/** Presets de acento dinámico (solo primary/surface decorativa — no roles clínicos). */
export const accentPresets: Record<
  Epis2Accent,
  Pick<PaletteOptions, 'primary' | 'secondary'> & { surfaceTint?: string }
> = {
  clinicalBlue: {
    primary: { main: '#1E6FD6', light: '#E8F1FF', dark: '#0F4FB0', contrastText: '#FFFFFF' },
    secondary: { main: '#475569', light: '#F1F5F9', dark: '#334155', contrastText: '#FFFFFF' },
    surfaceTint: '#E8F1FF',
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
    primary: { main: '#334155', light: '#F1F5F9', dark: '#1E293B', contrastText: '#FFFFFF' },
    secondary: { main: '#64748B', light: '#F8FAFC', dark: '#475569', contrastText: '#FFFFFF' },
    surfaceTint: '#F1F5F9',
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
  surfaceContainer: '#F8FAFC',
  surfaceContainerHigh: '#F1F5F9',
  onSurface: '#0F172A',
  onSurfaceVariant: '#64748B',
  outline: '#CBD5E1',
  outlineVariant: '#E2E8F0',
};

const darkSurfaces: M3SurfaceRoles = {
  surface: '#1E293B',
  surfaceContainer: '#0F172A',
  surfaceContainerHigh: '#334155',
  onSurface: '#F8FAFC',
  onSurfaceVariant: '#94A3B8',
  outline: '#475569',
  outlineVariant: '#334155',
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
    error: { main: '#B42318', contrastText: '#FFFFFF' },
    warning: { main: '#9A6700', contrastText: '#FFFFFF' },
    success: { main: '#18794E', contrastText: '#FFFFFF' },
    info: { main: '#0288D1', contrastText: '#FFFFFF' },
  };
}

export { lightSurfaces, darkSurfaces };
