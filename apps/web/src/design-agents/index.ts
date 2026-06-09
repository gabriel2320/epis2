export { areDesignAgentsEnabled, getDesignAgentsConfig } from './designAgentsEnv.js';
export type { DesignScreenContext } from './designScreenContext.js';
export * from './schemas.js';
export { md3LayoutCriticAgent } from './md3LayoutCriticAgent.js';
export { classicEmrWorkflowAgent } from './classicEmrWorkflowAgent.js';
export { commandCenterAgent } from './commandCenterAgent.js';
export { visualDensityAgent } from './visualDensityAgent.js';
export { clinicalSafetyUiAgent } from './clinicalSafetyUiAgent.js';
export { accessibilityAgent } from './accessibilityAgent.js';
export { screenshotCriticAgent } from './screenshotCriticAgent.js';
export { patchPlannerAgent } from './patchPlannerAgent.js';
export {
  dashboardMd3CriticAgent,
  dashboardWorkflowAgent,
  dashboardDensityAgent,
  dashboardSafetyAgent,
  dashboardDataQualityAgent,
  dashboardAccessibilityAgent,
  dashboardScreenshotCriticAgent,
  dashboardPatchPlannerAgent,
} from './dashboardDesignAgents.js';

import type { DesignScreenContext } from './designScreenContext.js';
import { accessibilityAgent } from './accessibilityAgent.js';
import { classicEmrWorkflowAgent } from './classicEmrWorkflowAgent.js';
import { clinicalSafetyUiAgent } from './clinicalSafetyUiAgent.js';
import { commandCenterAgent } from './commandCenterAgent.js';
import {
  dashboardAccessibilityAgent,
  dashboardDataQualityAgent,
  dashboardDensityAgent,
  dashboardMd3CriticAgent,
  dashboardPatchPlannerAgent,
  dashboardSafetyAgent,
  dashboardScreenshotCriticAgent,
  dashboardWorkflowAgent,
} from './dashboardDesignAgents.js';
import { md3LayoutCriticAgent } from './md3LayoutCriticAgent.js';
import { patchPlannerAgent } from './patchPlannerAgent.js';
import { screenshotCriticAgent } from './screenshotCriticAgent.js';
import { visualDensityAgent } from './visualDensityAgent.js';

/** Ejecuta agentes de diseño para una pantalla — advisory, no bloqueante. */
export async function runDesignAgentsForScreen(ctx: DesignScreenContext) {
  const layout = await md3LayoutCriticAgent(ctx);
  const classic = ctx.mode === 'classic' ? await classicEmrWorkflowAgent(ctx) : null;
  const command = ctx.pathname === '/comando' ? await commandCenterAgent(ctx) : null;
  const dashboard =
    ctx.mode === 'dashboard' || ctx.pathname.includes('/epis2/dashboard')
      ? {
          md3: await dashboardMd3CriticAgent(ctx),
          workflow: await dashboardWorkflowAgent(ctx),
          density: await dashboardDensityAgent(ctx),
          safety: await dashboardSafetyAgent(ctx),
          dataQuality: await dashboardDataQualityAgent(ctx),
          a11y: await dashboardAccessibilityAgent(ctx),
          screenshot: await dashboardScreenshotCriticAgent(ctx),
        }
      : null;
  const density = await visualDensityAgent(ctx);
  const safety = await clinicalSafetyUiAgent(ctx);
  const a11y = await accessibilityAgent(ctx);
  const screenshot = await screenshotCriticAgent(ctx);

  const violations = [
    ...(layout.ok ? layout.result.violations : []),
    ...(classic?.ok ? classic.result.violations : []),
    ...(command?.ok ? command.result.violations : []),
    ...(dashboard?.md3.ok ? dashboard.md3.result.violations : []),
  ];
  const plan =
    ctx.mode === 'dashboard'
      ? await dashboardPatchPlannerAgent(ctx, violations)
      : await patchPlannerAgent(ctx, violations);

  return { layout, classic, command, dashboard, density, safety, a11y, screenshot, plan };
}
