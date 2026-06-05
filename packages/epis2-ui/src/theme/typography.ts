/** Tipografía alineada a roles M3 (alias sobre variantes MUI). */
export const epis2TypographyRoles = {
  displayLarge: {
    fontSize: '3rem',
    lineHeight: 1.15,
    fontWeight: 500,
    letterSpacing: '-0.02em',
  },
  displayMedium: {
    fontSize: '2.25rem',
    lineHeight: 1.2,
    fontWeight: 500,
    letterSpacing: '-0.02em',
  },
  headlineLarge: {
    fontSize: '2rem',
    lineHeight: 1.25,
    fontWeight: 500,
  },
  headlineMedium: {
    fontSize: '1.5rem',
    lineHeight: 1.3,
    fontWeight: 500,
  },
  titleLarge: {
    fontSize: '1.25rem',
    lineHeight: 1.35,
    fontWeight: 600,
  },
  titleMedium: {
    fontSize: '1.125rem',
    lineHeight: 1.4,
    fontWeight: 600,
  },
  bodyLarge: {
    fontSize: '1rem',
    lineHeight: 1.55,
    fontWeight: 400,
  },
  bodyMedium: {
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  labelLarge: {
    fontSize: '0.875rem',
    lineHeight: 1.4,
    fontWeight: 600,
  },
  labelMedium: {
    fontSize: '0.8125rem',
    lineHeight: 1.35,
    fontWeight: 600,
  },
} as const;

import type { ThemeOptions } from '@mui/material/styles';

export const epis2Typography: NonNullable<ThemeOptions['typography']> = {
  fontFamily: 'Inter, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
  h1: epis2TypographyRoles.displayLarge,
  h2: epis2TypographyRoles.displayMedium,
  h3: epis2TypographyRoles.headlineLarge,
  h4: epis2TypographyRoles.headlineMedium,
  h5: epis2TypographyRoles.titleLarge,
  h6: epis2TypographyRoles.titleMedium,
  body1: epis2TypographyRoles.bodyLarge,
  body2: epis2TypographyRoles.bodyMedium,
  subtitle1: epis2TypographyRoles.titleMedium,
  subtitle2: epis2TypographyRoles.labelLarge,
  button: {
    ...epis2TypographyRoles.labelLarge,
    textTransform: 'none',
  },
  caption: epis2TypographyRoles.labelMedium,
};

/** Variantes semánticas M3 para Typography. */
export const epis2M3TypographyVariants = {
  displayLarge: 'h1',
  displayMedium: 'h2',
  headlineLarge: 'h3',
  headlineMedium: 'h4',
  titleLarge: 'h5',
  titleMedium: 'h6',
  bodyLarge: 'body1',
  bodyMedium: 'body2',
  labelLarge: 'subtitle2',
  labelMedium: 'caption',
} as const;

export type Epis2M3TypographyRole = keyof typeof epis2TypographyRoles;
