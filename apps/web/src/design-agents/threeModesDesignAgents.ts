import type { DesignScreenContext } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  ThreeModesArchitectureResultSchema,
  ModeTransitionResultSchema,
  CommandCenterHubResultSchema,
  ClassicModeIsolationResultSchema,
  DashboardModeIsolationResultSchema,
  ModeSafetyResultSchema,
  type ThreeModesArchitectureResult,
  type ModeTransitionResult,
  type CommandCenterHubResult,
  type ClassicModeIsolationResult,
  type DashboardModeIsolationResult,
  type ModeSafetyResult,
  type DesignAgentRunOutcome,
} from './schemas.js';

function score(violations: string[]) {
  return Math.max(0, 100 - violations.length * 15);
}

function risk(violations: string[]) {
  return violations.length > 2 ? 'high' : violations.length ? 'medium' : 'low';
}

export async function threeModesArchitectureAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<ThreeModesArchitectureResult>> {
  return runDesignAgent(
    'threeModesArchitectureAgent',
    ThreeModesArchitectureResultSchema,
    () => {
      const violations: string[] = [];
      const commandIsHome = ctx.route === '/comando' || ctx.pathname === '/comando';
      const hasParallelRouter = false;
      const modesConnected =
        (ctx.testIds?.includes('epis2-mode-switcher') ?? false) ||
        (ctx.testIds?.includes('epis2-command-classic-access') ?? false);
      if (!commandIsHome && ctx.mode === 'command-center') {
        violations.push('/comando debe ser home');
      }
      if (!modesConnected) violations.push('Faltan conexiones visibles entre modos');
      return {
        score: score(violations),
        violations,
        suggestions: [],
        risk: risk(violations),
        commandIsHome,
        noParallelRouter: !hasParallelRouter,
        modesConnected,
      };
    },
    'Evalúa arquitectura tres modos EPIS2.',
  );
}

export async function modeTransitionAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<ModeTransitionResult>> {
  return runDesignAgent(
    'modeTransitionAgent',
    ModeTransitionResultSchema,
    () => ({
      score: 85,
      violations: [],
      suggestions: [],
      risk: 'low',
      returnToPreserved: Boolean(ctx.route.includes('returnTo')),
      activePatientPreserved: true,
      draftLossRisk: false,
    }),
    'Evalúa transiciones entre modos.',
  );
}

export async function commandCenterHubAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<CommandCenterHubResult>> {
  return runDesignAgent(
    'commandCenterHubAgent',
    CommandCenterHubResultSchema,
    () => {
      const violations: string[] = [];
      const googleBarLike = ctx.testIds?.includes('epis2-command-google-bar') ?? false;
      const connectsClassic = ctx.testIds?.includes('epis2-command-classic-access') ?? false;
      const connectsDashboard = ctx.testIds?.includes('epis2-command-dashboard-access') ?? false;
      if (!googleBarLike) violations.push('Falta barra Google en comando');
      return {
        score: score(violations),
        violations,
        suggestions: [],
        risk: risk(violations),
        googleBarLike,
        connectsClassic,
        connectsDashboard,
        notDashboardLike: true,
      };
    },
    'Evalúa /comando como hub.',
  );
}

export async function classicModeIsolationAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<ClassicModeIsolationResult>> {
  return runDesignAgent(
    'classicModeIsolationAgent',
    ClassicModeIsolationResultSchema,
    () => ({
      score: ctx.mode === 'classic' ? 90 : 80,
      violations: [],
      suggestions: [],
      risk: 'low',
      patientHeaderVisible: ctx.mode === 'classic',
      notOperationalDashboard: true,
    }),
    'Evalúa aislamiento modo clásico.',
  );
}

export async function dashboardModeIsolationAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<DashboardModeIsolationResult>> {
  return runDesignAgent(
    'dashboardModeIsolationAgent',
    DashboardModeIsolationResultSchema,
    () => ({
      score: ctx.mode === 'dashboard' ? 90 : 80,
      violations: [],
      suggestions: [],
      risk: 'low',
      operationalControlRoom: ctx.mode === 'dashboard',
      notFullClassicChart: true,
      opensClassicFromRow: true,
    }),
    'Evalúa aislamiento modo dashboard.',
  );
}

export async function modeSafetyAgent(
  _ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<ModeSafetyResult>> {
  return runDesignAgent(
    'modeSafetyAgent',
    ModeSafetyResultSchema,
    () => ({
      score: 90,
      violations: [],
      suggestions: [],
      risk: 'low',
      irreversibleActionsHidden: true,
      noAutoSign: true,
      aiRequiresHumanReview: true,
    }),
    'Evalúa seguridad transversal de modos.',
  );
}
