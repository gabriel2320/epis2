import type { ClinicalRole } from '@epis2/clinical-domain';

/** Superficies donde puede montarse un widget (home sigue siendo Centro de Comando). */
export type WidgetSurface =
  | 'command-center'
  | 'patient-workspace'
  | 'clinical-form'
  | 'dashboard';

/** Requisitos de contexto que puede exigir un widget. */
export const WIDGET_CONTEXT_REQUIREMENTS = [
  'user',
  'role',
  'patient',
  'encounter',
  'service',
  'command',
  'activity',
] as const;

export type WidgetContextRequirement = (typeof WIDGET_CONTEXT_REQUIREMENTS)[number];

export type WidgetContext = {
  surface: WidgetSurface;
  userId?: string;
  role?: ClinicalRole;
  patientId?: string;
  encounterId?: string;
  serviceId?: string;
  commandIntent?: string;
  activityId?: string;
  /** Widgets ocultos que el usuario o el flujo reveló explícitamente. */
  explicitlyShownWidgetIds?: readonly string[];
  offline?: boolean;
};

export function hasWidgetContextRequirement(
  context: WidgetContext,
  requirement: WidgetContextRequirement,
): boolean {
  switch (requirement) {
    case 'user':
      return Boolean(context.userId?.trim());
    case 'role':
      return Boolean(context.role);
    case 'patient':
      return Boolean(context.patientId?.trim());
    case 'encounter':
      return Boolean(context.encounterId?.trim());
    case 'service':
      return Boolean(context.serviceId?.trim());
    case 'command':
      return Boolean(context.commandIntent?.trim());
    case 'activity':
      return Boolean(context.activityId?.trim());
    default:
      return false;
  }
}
