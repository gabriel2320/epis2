import type { ClinicalRole } from '@epis2/clinical-domain';
import type { WidgetContextRequirement } from './widget-context.js';
import type { WidgetStateKind } from './widget-state.js';

export const WIDGET_CATEGORIES = [
  'command-center',
  'patient',
  'clinical',
  'ai-assistance',
  'safety',
  'dashboard',
  'administration',
] as const;

export type WidgetCategory = (typeof WIDGET_CATEGORIES)[number];

export type WidgetClinicalRisk = 'low' | 'medium' | 'high';

export type WidgetDataSource = 'synthetic' | 'api' | 'local-cache' | 'none';

export type WidgetRefreshPolicy = 'manual' | 'on-context' | 'interval' | 'never';

/** IA opcional con fallback offline; nunca obligatoria para renderizar. */
export type WidgetAiMode = 'none' | 'optional-offline' | 'assist-only';

export type WidgetDefaultSize = 'compact' | 'medium' | 'wide' | 'tall';

/** Acciones permitidas: navegación o comando — nunca escritura clínica directa. */
export const WIDGET_ACTION_KINDS = ['navigate', 'command'] as const;

export type WidgetActionKind = (typeof WIDGET_ACTION_KINDS)[number];

export type WidgetAction = {
  kind: WidgetActionKind;
  label: string;
  route?: string;
  command?: string;
};

export type WidgetCopy = {
  loading: string;
  empty: string;
  error: string;
  forbidden: string;
  offline: string;
  aiDisclosure?: string;
};

export type WidgetDefinition = {
  id: string;
  label: string;
  description: string;
  category: WidgetCategory;
  allowedRoles: readonly ClinicalRole[];
  requiredContext: readonly WidgetContextRequirement[];
  defaultSize: WidgetDefaultSize;
  clinicalRisk: WidgetClinicalRisk;
  dataSource: WidgetDataSource;
  refreshPolicy: WidgetRefreshPolicy;
  aiMode: WidgetAiMode;
  route?: string;
  command?: string;
  hiddenByDefault: boolean;
  requiresHumanApproval: boolean;
  supportedStates: readonly WidgetStateKind[];
  actions: readonly WidgetAction[];
  copy: WidgetCopy;
};
