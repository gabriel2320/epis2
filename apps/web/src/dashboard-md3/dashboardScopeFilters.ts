export type DashboardScopeFilters = {
  institution?: string;
  site?: string;
  service?: string;
  unit?: string;
  date?: string;
  shift?: string;
  status?: string;
  priority?: string;
  assignee?: string;
};

export const DEFAULT_DASHBOARD_SCOPE: DashboardScopeFilters = {
  institution: 'Institución demo',
  site: 'Sede central',
  service: 'Medicina interna',
  unit: 'Todas',
  date: new Date().toISOString().slice(0, 10),
  shift: 'Turno actual',
};

export function activeScopeFilterChips(
  filters: DashboardScopeFilters,
): { key: keyof DashboardScopeFilters; label: string }[] {
  const chips: { key: keyof DashboardScopeFilters; label: string }[] = [];
  for (const [key, value] of Object.entries(filters) as [
    keyof DashboardScopeFilters,
    string | undefined,
  ][]) {
    if (value && value !== 'Todas') {
      chips.push({ key, label: value });
    }
  }
  return chips;
}
