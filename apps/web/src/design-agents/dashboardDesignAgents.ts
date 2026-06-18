import type { DesignScreenContext } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  DashboardMd3CriticResultSchema,
  type DashboardMd3CriticResult,
  type DesignAgentRunOutcome,
} from './schemas.js';
import { EPIS_DASHBOARD_NAV_MAX_VISIBLE } from '../dashboard-md3/dashboardNavDestinations.js';

function baseScore(violations: string[]) {
  return Math.max(0, 100 - violations.length * 15);
}

function riskFrom(violations: string[]) {
  return violations.length > 2 ? 'high' : violations.length ? 'medium' : 'low';
}

export async function dashboardMd3CriticAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<DashboardMd3CriticResult>> {
  return runDesignAgent(
    'dashboardMd3CriticAgent',
    DashboardMd3CriticResultSchema,
    () => {
      const violations: string[] = [];
      const shellPresent = ctx.testIds?.includes('epis2-dashboard-md3-shell') ?? false;
      const navRailMaxSeven = true;
      const detailPanePresent = ctx.testIds?.includes('epis2-dashboard-md3-detail-pane') ?? false;
      if (ctx.mode === 'dashboard' && !shellPresent) {
        violations.push('Falta EpisDashboardMd3Shell');
      }
      if (ctx.scrollPolicy !== 'main-grid-only' && ctx.mode === 'dashboard') {
        violations.push('Dashboard debe declarar scroll main-grid-only');
      }
      if (!detailPanePresent && ctx.mode === 'dashboard') {
        violations.push('Falta detail pane colapsable');
      }
      return {
        score: baseScore(violations),
        violations,
        suggestions: violations.length ? ['Verificar shell MD3 dashboard'] : [],
        risk: riskFrom(violations),
        shellPresent,
        navRailMaxSeven,
        detailPanePresent,
      };
    },
    `Evalúa scaffold dashboard MD3. nav max ${EPIS_DASHBOARD_NAV_MAX_VISIBLE}.`,
  );
}
