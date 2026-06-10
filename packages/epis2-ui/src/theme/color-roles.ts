import type { PaletteOptions } from '@mui/material/styles';

export type Epis2Accent =
  | 'clinicalBlue'
  | 'tealBlue'
  | 'slateProfessional'
  | 'sageClinical'
  | 'oceanDepth'
  | 'warmLinen'
  | 'monochrome'
  | 'calmGreen'
  | 'soberViolet'
  | 'neutral';

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
  slateProfessional: {
    primary: { main: '#475569', light: '#DCE3ED', dark: '#334155', contrastText: '#FFFFFF' },
    secondary: { main: '#5C6470', light: '#E0E4EA', dark: '#444B57', contrastText: '#FFFFFF' },
    surfaceTint: '#ECEEF2',
  },
  sageClinical: {
    primary: { main: '#28644A', light: '#B8EAD0', dark: '#1B4D38', contrastText: '#FFFFFF' },
    secondary: { main: '#4F6358', light: '#D2E8DA', dark: '#374B41', contrastText: '#FFFFFF' },
    surfaceTint: '#E9EFEB',
  },
  oceanDepth: {
    primary: { main: '#0C4A6E', light: '#C8E6FF', dark: '#083550', contrastText: '#FFFFFF' },
    secondary: { main: '#4F6070', light: '#D2E4F4', dark: '#374858', contrastText: '#FFFFFF' },
    surfaceTint: '#E9EEF5',
  },
  warmLinen: {
    primary: { main: '#78716C', light: '#F0EAE4', dark: '#57534E', contrastText: '#FFFFFF' },
    secondary: { main: '#635F5B', light: '#EAE4DE', dark: '#4B4743', contrastText: '#FFFFFF' },
    surfaceTint: '#F4EFEB',
  },
  monochrome: {
    primary: { main: '#171717', light: '#E5E5E5', dark: '#0A0A0A', contrastText: '#FFFFFF' },
    secondary: { main: '#525252', light: '#F0F0F0', dark: '#404040', contrastText: '#FFFFFF' },
    surfaceTint: '#F2F2F2',
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
  /** Tono más apagado que surface — fondos atenuados (M3 tone-based surfaces). */
  surfaceDim: string;
  /** Tono más brillante que surface — énfasis sin elevación. */
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  /** Superficie invertida — snackbars/tooltips de alto contraste. */
  inverseSurface: string;
  inverseOnSurface: string;
  /** Velo modal M3 — usar siempre con alpha en el punto de uso. */
  scrim: string;
};

const lightSurfaces: M3SurfaceRoles = {
  surface: '#FFFFFF',
  surfaceDim: '#DDDDE0',
  surfaceBright: '#FCFCFD',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#FAFAFB',
  surfaceContainer: '#F5F5F7',
  surfaceContainerHigh: '#EBEBED',
  surfaceContainerHighest: '#E4E4E7',
  onSurface: '#18181B',
  onSurfaceVariant: '#71717A',
  outline: '#E4E4E7',
  outlineVariant: '#F0F0F2',
  inverseSurface: '#27272A',
  inverseOnSurface: '#F4F4F5',
  scrim: '#000000',
};

/** warning/success/info — fijos; no provienen de MTB. */
export const epis2SemanticPalette = {
  warning: { main: '#D97706', light: '#FEF3C7', dark: '#92400E', contrastText: '#FFFFFF' },
  success: { main: '#059669', light: '#D1FAE5', dark: '#047857', contrastText: '#FFFFFF' },
  info: { main: '#0891B2', light: '#CFFAFE', dark: '#0E7490', contrastText: '#FFFFFF' },
} as const;

const darkSurfaces: M3SurfaceRoles = {
  surface: '#1C1C1E',
  surfaceDim: '#101012',
  surfaceBright: '#3A3A3C',
  surfaceContainerLowest: '#0F0F10',
  surfaceContainerLow: '#1A1A1C',
  surfaceContainer: '#141416',
  surfaceContainerHigh: '#2C2C2E',
  surfaceContainerHighest: '#363638',
  onSurface: '#FAFAFA',
  onSurfaceVariant: '#A1A1AA',
  outline: '#3F3F46',
  outlineVariant: '#27272A',
  inverseSurface: '#F4F4F5',
  inverseOnSurface: '#27272A',
  scrim: '#000000',
};

export function buildM3PaletteOptions(mode: 'light' | 'dark', accent: Epis2Accent): PaletteOptions {
  const preset = accentPresets[accent];
  const surfaces = mode === 'light' ? lightSurfaces : darkSurfaces;

  return {
    mode,
    primary: preset.primary!,
    secondary: preset.secondary!,
    // Path legacy sin MTB: tertiary cae al secondary del preset (documentado).
    tertiary: preset.secondary!,
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
