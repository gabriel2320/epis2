import { z } from 'zod';

export const DesignAgentRiskSchema = z.enum(['low', 'medium', 'high']);

export const Md3LayoutCriticResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
});

export const ClassicEmrWorkflowResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  patientAlwaysVisible: z.boolean(),
  mainPaneWritable: z.boolean(),
  supportingPaneNonCompeting: z.boolean(),
});

export const CommandCenterCriticResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  googleBarLike: z.boolean(),
  classicAccessVisible: z.boolean(),
  maxSuggestionsRespected: z.boolean(),
});

export const VisualDensityResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  cardCountEstimate: z.number().int().min(0),
  iconCountEstimate: z.number().int().min(0),
});

export const ClinicalSafetyUiResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  irreversibleInTopBar: z.boolean(),
  duplicateActionBars: z.boolean(),
});

export const AccessibilityResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  keyboardNavLikely: z.boolean(),
});

export const ScreenshotCriticResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  screenshotPath: z.string().optional(),
});

export const PatchPlanSchema = z.object({
  files: z.array(z.string()),
  changes: z.array(z.string()),
  risks: z.array(z.string()),
  testsRequired: z.array(z.string()),
  gatesRequired: z.array(z.string()),
});

export type Md3LayoutCriticResult = z.infer<typeof Md3LayoutCriticResultSchema>;
export type ClassicEmrWorkflowResult = z.infer<typeof ClassicEmrWorkflowResultSchema>;
export type CommandCenterCriticResult = z.infer<typeof CommandCenterCriticResultSchema>;
export type VisualDensityResult = z.infer<typeof VisualDensityResultSchema>;
export type ClinicalSafetyUiResult = z.infer<typeof ClinicalSafetyUiResultSchema>;
export type AccessibilityResult = z.infer<typeof AccessibilityResultSchema>;
export type ScreenshotCriticResult = z.infer<typeof ScreenshotCriticResultSchema>;
export type PatchPlan = z.infer<typeof PatchPlanSchema>;

export const DashboardMd3CriticResultSchema = Md3LayoutCriticResultSchema.extend({
  shellPresent: z.boolean(),
  navRailMaxSeven: z.boolean(),
  detailPanePresent: z.boolean(),
});

export const DashboardWorkflowResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  kpisActionable: z.boolean(),
  domainHasOwner: z.boolean(),
});

export const DashboardDensityResultSchema = VisualDensityResultSchema.extend({
  gridOverCardRatio: z.number().min(0).max(1),
});

export const DashboardSafetyResultSchema = ClinicalSafetyUiResultSchema.extend({
  bulkActionsConfirmed: z.boolean(),
  noAutoSignFromWidget: z.boolean(),
});

export const DashboardDataQualityResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  metricsHaveTimestamp: z.boolean(),
  filtersUnambiguous: z.boolean(),
});

export const DashboardAccessibilityResultSchema = AccessibilityResultSchema;

export const DashboardScreenshotCriticResultSchema = ScreenshotCriticResultSchema;

export const DashboardPatchPlanSchema = PatchPlanSchema;

export type DashboardMd3CriticResult = z.infer<typeof DashboardMd3CriticResultSchema>;
export type DashboardWorkflowResult = z.infer<typeof DashboardWorkflowResultSchema>;
export type DashboardDensityResult = z.infer<typeof DashboardDensityResultSchema>;
export type DashboardSafetyResult = z.infer<typeof DashboardSafetyResultSchema>;
export type DashboardDataQualityResult = z.infer<typeof DashboardDataQualityResultSchema>;
export type DashboardAccessibilityResult = z.infer<typeof DashboardAccessibilityResultSchema>;
export type DashboardScreenshotCriticResult = z.infer<typeof DashboardScreenshotCriticResultSchema>;
export type DashboardPatchPlan = z.infer<typeof DashboardPatchPlanSchema>;

export const ThreeModesArchitectureResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  commandIsHome: z.boolean(),
  noParallelRouter: z.boolean(),
  modesConnected: z.boolean(),
});

export const ModeTransitionResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  returnToPreserved: z.boolean(),
  activePatientPreserved: z.boolean(),
  draftLossRisk: z.boolean(),
});

export const CommandCenterHubResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  googleBarLike: z.boolean(),
  connectsClassic: z.boolean(),
  connectsDashboard: z.boolean(),
  notDashboardLike: z.boolean(),
});

export const ClassicModeIsolationResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  patientHeaderVisible: z.boolean(),
  notOperationalDashboard: z.boolean(),
});

export const DashboardModeIsolationResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  operationalControlRoom: z.boolean(),
  notFullClassicChart: z.boolean(),
  opensClassicFromRow: z.boolean(),
});

export const ModeSafetyResultSchema = z.object({
  score: z.number().min(0).max(100),
  violations: z.array(z.string()),
  suggestions: z.array(z.string()),
  risk: DesignAgentRiskSchema,
  irreversibleActionsHidden: z.boolean(),
  noAutoSign: z.boolean(),
  aiRequiresHumanReview: z.boolean(),
});

export type ThreeModesArchitectureResult = z.infer<typeof ThreeModesArchitectureResultSchema>;
export type ModeTransitionResult = z.infer<typeof ModeTransitionResultSchema>;
export type CommandCenterHubResult = z.infer<typeof CommandCenterHubResultSchema>;
export type ClassicModeIsolationResult = z.infer<typeof ClassicModeIsolationResultSchema>;
export type DashboardModeIsolationResult = z.infer<typeof DashboardModeIsolationResultSchema>;
export type ModeSafetyResult = z.infer<typeof ModeSafetyResultSchema>;

export type DesignAgentResult =
  | Md3LayoutCriticResult
  | ClassicEmrWorkflowResult
  | CommandCenterCriticResult
  | VisualDensityResult
  | ClinicalSafetyUiResult
  | AccessibilityResult
  | ScreenshotCriticResult
  | PatchPlan;

export type DesignAgentRunOutcome<T> =
  | { ok: true; source: 'heuristic' | 'ollama'; result: T }
  | { ok: false; source: 'heuristic' | 'ollama'; error: string; degraded: true };
