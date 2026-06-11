/** Preview dual chart modes — solo dev o flag explícito (ADR-002). */
export function isDualChartModesEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_DUAL_CHART_MODES;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return import.meta.env.DEV;
}

export type ChartModeId = 'traditional' | 'paper';

export function parseChartMode(value: unknown): ChartModeId {
  return value === 'paper' ? 'paper' : 'traditional';
}
