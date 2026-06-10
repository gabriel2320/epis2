import type { ServiceDashboardResponse } from '@epis2/contracts';

export function buildServiceKpiChart(data: ServiceDashboardResponse) {
  const occupied = data.census.filter((b) => b.status === 'occupied').length;
  return {
    xAxisLabels: ['Camas ocupadas', 'Críticos sin acuse', 'Órdenes activas', 'Pendientes revisión'],
    series: [
      {
        label: 'Indicadores',
        data: [
          occupied,
          data.unacknowledgedCriticals.length,
          data.activeOrders.length,
          data.pendingWorkItems.length,
        ],
      },
    ],
  };
}
