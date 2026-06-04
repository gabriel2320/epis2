import type { DashboardWorkResponse } from '@epis2/contracts';
import { apiFetch } from './client.js';

export function fetchDashboardWork() {
  return apiFetch<DashboardWorkResponse>('/api/dashboard/work');
}
