/** Breakpoints EPIS2 para diseño adaptativo M3 (M3-06). */
export const epis2Breakpoints = {
  compact: 0,
  medium: 768,
  expanded: 1280,
} as const;

export type Epis2BreakpointKey = keyof typeof epis2Breakpoints;

/** Media queries estándar EPIS2. */
export const epis2MediaQueries = {
  compactOnly: `(max-width: ${epis2Breakpoints.medium - 1}px)`,
  mediumUp: `(min-width: ${epis2Breakpoints.medium}px)`,
  expandedUp: `(min-width: ${epis2Breakpoints.expanded}px)`,
} as const;
