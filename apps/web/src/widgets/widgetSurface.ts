import {
  EPIS2_WIDGET_REGISTRY,
  type WidgetDefinition,
  type WidgetSurface,
} from '@epis2/epis2-widgets';

const SURFACE_CATEGORIES: Record<WidgetSurface, readonly WidgetDefinition['category'][]> = {
  'command-center': ['command-center', 'clinical'],
  'patient-workspace': ['patient', 'clinical'],
  'clinical-form': ['clinical'],
  dashboard: ['dashboard'],
};

/** Widgets candidatos por superficie (antes de visibilidad/permisos). */
export function listWidgetCandidatesForSurface(
  surface: WidgetSurface,
): readonly WidgetDefinition[] {
  const categories = SURFACE_CATEGORIES[surface];
  return EPIS2_WIDGET_REGISTRY.filter((w) => categories.includes(w.category));
}
