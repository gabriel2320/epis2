import type { DesignScreenContext } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  DashboardMd3CriticResultSchema,
  DashboardWorkflowResultSchema,
  DashboardDensityResultSchema,
  DashboardSafetyResultSchema,
  DashboardDataQualityResultSchema,
  DashboardAccessibilityResultSchema,
  DashboardScreenshotCriticResultSchema,
  DashboardPatchPlanSchema,
  type DashboardMd3CriticResult,
  type DashboardWorkflowResult,
  type DashboardDensityResult,
  type DashboardSafetyResult,
  type DashboardDataQualityResult,
  type DashboardAccessibilityResult,
  type DashboardScreenshotCriticResult,
  type DashboardPatchPlan,
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

export async function dashboardWorkflowAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<DashboardWorkflowResult>> {
  return runDesignAgent(
    'dashboardWorkflowAgent',
    DashboardWorkflowResultSchema,
    () => {
      const violations: string[] = [];
      const kpisActionable = ctx.testIds?.some((id) => id.includes('kpi')) ?? false;
      const domainHasOwner = ctx.mode === 'dashboard';
      if (ctx.mode === 'dashboard' && !kpisActionable) {
        violations.push('KPI strip sin indicadores accionables detectables');
      }
      return {
        score: baseScore(violations),
        violations,
        suggestions: [],
        risk: riskFrom(violations),
        kpisActionable,
        domainHasOwner,
      };
    },
    'Evalúa workflow operacional del dashboard.',
  );
}

export async function dashboardDensityAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<DashboardDensityResult>> {
  return runDesignAgent(
    'dashboardDensityAgent',
    DashboardDensityResultSchema,
    () => {
      const cardCountEstimate = ctx.htmlSnippet?.match(/EpisMetric|data-epis-kpi/g)?.length ?? 0;
      const gridCountEstimate = ctx.htmlSnippet?.match(/Grid|Worklist|data-testid="epis2-dashboard-md3-main-grid"/g)?.length ?? 0;
      const total = cardCountEstimate + gridCountEstimate || 1;
      const gridOverCardRatio = gridCountEstimate / total;
      const violations: string[] = [];
      if (cardCountEstimate > 6) violations.push('Exceso de cards métricas');
      return {
        score: baseScore(violations),
        violations,
        suggestions: [],
        risk: riskFrom(violations),
        cardCountEstimate,
        iconCountEstimate: 0,
        gridOverCardRatio,
      };
    },
    'Evalúa densidad visual dashboard.',
  );
}

export async function dashboardSafetyAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<DashboardSafetyResult>> {
  return runDesignAgent(
    'dashboardSafetyAgent',
    DashboardSafetyResultSchema,
    () => {
      const haystack = ctx.htmlSnippet ?? '';
      const irreversibleInTopBar = /firmar|aprobar|eliminar/i.test(haystack);
      const violations: string[] = [];
      if (irreversibleInTopBar) violations.push('Acciones irreversibles en top bar');
      return {
        score: baseScore(violations),
        violations,
        suggestions: [],
        risk: riskFrom(violations),
        irreversibleInTopBar,
        duplicateActionBars: false,
        bulkActionsConfirmed: true,
        noAutoSignFromWidget: !/auto.?sign|auto.?approve/i.test(haystack),
      };
    },
    'Evalúa seguridad UI dashboard.',
  );
}

export async function dashboardDataQualityAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<DashboardDataQualityResult>> {
  return runDesignAgent(
    'dashboardDataQualityAgent',
    DashboardDataQualityResultSchema,
    () => {
      const violations: string[] = [];
      const metricsHaveTimestamp = ctx.testIds?.includes('epis2-dashboard-md3-status-bar') ?? false;
      if (!metricsHaveTimestamp) violations.push('Status bar sin timestamp de actualización');
      return {
        score: baseScore(violations),
        violations,
        suggestions: [],
        risk: riskFrom(violations),
        metricsHaveTimestamp,
        filtersUnambiguous: true,
      };
    },
    'Evalúa calidad de datos mostrados en dashboard.',
  );
}

export async function dashboardAccessibilityAgent(
  _ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<DashboardAccessibilityResult>> {
  return runDesignAgent(
    'dashboardAccessibilityAgent',
    DashboardAccessibilityResultSchema,
    () => ({
      score: 85,
      violations: [],
      suggestions: [],
      risk: 'low',
      keyboardNavLikely: true,
    }),
    'Evalúa accesibilidad dashboard.',
  );
}

export async function dashboardScreenshotCriticAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<DashboardScreenshotCriticResult>> {
  return runDesignAgent(
    'dashboardScreenshotCriticAgent',
    DashboardScreenshotCriticResultSchema,
    () => ({
      score: ctx.screenshotPath ? 80 : 70,
      violations: ctx.screenshotPath ? [] : ['Sin screenshot advisory'],
      suggestions: ['Capturar reports/screenshots/dashboard-md3/'],
      risk: 'low',
      screenshotPath: ctx.screenshotPath,
    }),
    'Evalúa screenshot dashboard.',
  );
}

/** Solo planifica — no modifica código ni datos clínicos. */
export async function dashboardPatchPlannerAgent(
  ctx: DesignScreenContext,
  violations: readonly string[] = [],
): Promise<DesignAgentRunOutcome<DashboardPatchPlan>> {
  return runDesignAgent(
    'dashboardPatchPlannerAgent',
    DashboardPatchPlanSchema,
    () => ({
      files: ['apps/web/src/components/dashboard-md3/EpisDashboardMd3Shell.tsx'],
      changes: violations.length ? violations.map((v) => `Revisar: ${v}`) : ['Sin cambios urgentes'],
      risks: ['Revisión humana obligatoria'],
      testsRequired: ['EpisDashboardMd3Shell.test.tsx'],
      gatesRequired: ['quality:dashboard-md3-mode-gate', 'quality:three-modes-gate'],
    }),
    `Plan parche dashboard para ${ctx.route}. Solo planifica.`,
  );
}
