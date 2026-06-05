/**

 * Escala tipográfica unificada — base 14px.

 * Cuerpo y mensajes: 14px · Meta mínima: 13px · Sin texto por debajo de 13px.

 */

export const epis2TypographyRoles = {

  displayLarge: {

    fontSize: '1.25rem',

    lineHeight: 1.3,

    fontWeight: 600,

    letterSpacing: '-0.02em',

  },

  displayMedium: {

    fontSize: '1.25rem',

    lineHeight: 1.3,

    fontWeight: 600,

    letterSpacing: '-0.02em',

  },

  headlineLarge: {

    fontSize: '1.0625rem',

    lineHeight: 1.35,

    fontWeight: 600,

  },

  headlineMedium: {

    fontSize: '1rem',

    lineHeight: 1.4,

    fontWeight: 600,

  },

  titleLarge: {

    fontSize: '1rem',

    lineHeight: 1.4,

    fontWeight: 600,

  },

  titleMedium: {

    fontSize: '0.9375rem',

    lineHeight: 1.45,

    fontWeight: 600,

  },

  /** Texto principal — mensajes, párrafos, hints, estados vacíos. */

  bodyLarge: {

    fontSize: '0.875rem',

    lineHeight: 1.55,

    fontWeight: 400,

  },

  /** Alias de bodyLarge — misma talla en toda la UI. */

  bodyMedium: {

    fontSize: '0.875rem',

    lineHeight: 1.55,

    fontWeight: 400,

  },

  /** Etiquetas de campo, títulos de sección, chips. */

  labelLarge: {

    fontSize: '0.875rem',

    lineHeight: 1.5,

    fontWeight: 600,

  },

  /** Meta secundaria — piso mínimo 13px. */

  labelMedium: {

    fontSize: '0.8125rem',

    lineHeight: 1.5,

    fontWeight: 500,

  },

} as const;



import type { ThemeOptions } from '@mui/material/styles';



/** Encabezados y controles — Google Sans Text (estilo Google Workspace). */

export const epis2DisplayFontFamily =

  '"Google Sans Text", "Google Sans", "Product Sans", system-ui, sans-serif';



/** Cuerpo y metadata — Roboto. */

export const epis2BodyFontFamily = '"Roboto", "Helvetica Neue", Arial, sans-serif';



export const epis2FontFamily = epis2BodyFontFamily;



export const epis2Typography: NonNullable<ThemeOptions['typography']> = {

  fontSize: 14,

  fontFamily: epis2BodyFontFamily,

  h1: { ...epis2TypographyRoles.displayLarge, fontFamily: epis2DisplayFontFamily, fontWeight: 700 },

  h2: { ...epis2TypographyRoles.displayMedium, fontFamily: epis2DisplayFontFamily, fontWeight: 700 },

  h3: { ...epis2TypographyRoles.headlineLarge, fontFamily: epis2DisplayFontFamily, fontWeight: 500 },

  h4: { ...epis2TypographyRoles.headlineMedium, fontFamily: epis2DisplayFontFamily, fontWeight: 500 },

  h5: { ...epis2TypographyRoles.titleLarge, fontFamily: epis2DisplayFontFamily, fontWeight: 500 },

  h6: { ...epis2TypographyRoles.titleMedium, fontFamily: epis2DisplayFontFamily, fontWeight: 500 },

  body1: { ...epis2TypographyRoles.bodyLarge, fontWeight: 400 },

  body2: { ...epis2TypographyRoles.bodyMedium, fontWeight: 400 },

  subtitle1: { ...epis2TypographyRoles.titleMedium, fontFamily: epis2DisplayFontFamily, fontWeight: 500 },

  subtitle2: { ...epis2TypographyRoles.labelLarge, fontFamily: epis2DisplayFontFamily, fontWeight: 600 },

  button: {

    ...epis2TypographyRoles.labelLarge,

    fontFamily: epis2DisplayFontFamily,

    fontWeight: 500,

    textTransform: 'none',

  },

  caption: { ...epis2TypographyRoles.labelMedium, fontWeight: 400 },

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

  bodyMedium: 'body1',

  labelLarge: 'subtitle2',

  labelMedium: 'body2',

} as const;



export type Epis2M3TypographyRole = keyof typeof epis2TypographyRoles;


