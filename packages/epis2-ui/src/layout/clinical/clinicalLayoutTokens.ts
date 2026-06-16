/** EPIS2 Clinical Layout Engine — tokens (grilla 8dp, presupuestos de densidad). */

export const clinicalLayoutTokens = {
  unit: 8,

  page: {
    maxWidth: 1280,
    maxReadableWidth: 960,
    paperMaxWidth: 1440,
    minDesktopPadding: 24,
  },

  spacing: {
    xs: 0.5,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 6,
  },

  radius: {
    section: 2,
    field: 1,
  },

  density: {
    calm: {
      sectionGap: 3,
      fieldGap: 2,
      rowGap: 2,
    },
    compact: {
      sectionGap: 2,
      fieldGap: 1.5,
      rowGap: 1.5,
    },
  },

  actionBudget: {
    maxPrimary: 1,
    maxSecondaryVisible: 2,
    maxVisibleTotal: 3,
    overflowAfter: 3,
  },

  maxVisualDepth: 3,
  maxCardNesting: 2,
} as const;

export type ClinicalLayoutDensity = keyof typeof clinicalLayoutTokens.density;
