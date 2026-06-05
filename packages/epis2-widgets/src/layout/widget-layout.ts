import type { WidgetDefaultSize } from '../contracts/widget-definition.js';

export type WidgetLayoutBreakpoint = 'compact' | 'medium' | 'expanded';

export type WidgetGridPlacement = {
  columnSpan: number;
  minHeight: number;
  maxWidth?: number;
};

const SIZE_MAP: Record<WidgetDefaultSize, WidgetGridPlacement> = {
  compact: { columnSpan: 4, minHeight: 120 },
  medium: { columnSpan: 6, minHeight: 160 },
  wide: { columnSpan: 12, minHeight: 140 },
  tall: { columnSpan: 6, minHeight: 240 },
};

const RESPONSIVE_COLUMN_SPAN: Record<WidgetLayoutBreakpoint, Record<WidgetDefaultSize, number>> = {
  compact: { compact: 12, medium: 12, wide: 12, tall: 12 },
  medium: { compact: 6, medium: 6, wide: 12, tall: 6 },
  expanded: { compact: 4, medium: 6, wide: 12, tall: 6 },
};

export function resolveWidgetPlacement(
  size: WidgetDefaultSize,
  breakpoint: WidgetLayoutBreakpoint = 'medium',
  reducedMotion = false,
): WidgetGridPlacement & { transition: string } {
  const base = SIZE_MAP[size];
  return {
    ...base,
    columnSpan: RESPONSIVE_COLUMN_SPAN[breakpoint][size],
    transition: reducedMotion ? 'none' : 'grid-template-columns 200ms ease',
  };
}

export const WIDGET_GRID_COLUMNS = 12;
