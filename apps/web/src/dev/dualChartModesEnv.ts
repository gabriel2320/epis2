/** Dual ficha clásica + papel — default ON (opt-out con VITE_ENABLE_DUAL_CHART_MODES=false). */
export function isDualChartModesEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_DUAL_CHART_MODES;
  if (flag === 'false') return false;
  return true;
}

export type ChartModeId = 'traditional' | 'paper';

export function parseChartMode(value: unknown): ChartModeId {
  return value === 'paper' ? 'paper' : 'traditional';
}
