/** Esquema cromático Material 3 — roles obligatorios (Material Theme Builder). */
export interface Epis2MaterialColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  surface: string;
  surfaceDim: string;
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

  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;

  scrim: string;
  shadow: string;
}

export interface MaterialThemeSourceMetadata {
  id: string;
  label: string;
  sourceColor: string;
  importedAt: string;
  source: 'material-theme-builder';
  version: string;
}

export type Epis2ApprovedThemeId =
  | 'clinical-blue'
  | 'calm-teal'
  | 'clinical-calm'
  | 'slate-professional'
  | 'sage-clinical'
  | 'ocean-depth'
  | 'warm-linen'
  | 'monochrome-gray';

export interface Epis2ThemeOptions {
  themeId: Epis2ApprovedThemeId;
  mode: 'light' | 'dark';
  density: 'comfortable' | 'compact';
  contrast: 'standard' | 'high';
  motion: 'standard' | 'reduced';
}
