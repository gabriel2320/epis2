import type { WidgetContext } from '../contracts/widget-context.js';
import { hasWidgetContextRequirement } from '../contracts/widget-context.js';
import type { WidgetDefinition } from '../contracts/widget-definition.js';
import type { WidgetVisibility } from '../contracts/widget-result.js';
import { validateWidgetPermission } from '../permissions/validate-widget-permission.js';

function isExplicitlyShown(widget: WidgetDefinition, context: WidgetContext): boolean {
  return (context.explicitlyShownWidgetIds ?? []).includes(widget.id);
}

function hasRequiredContext(widget: WidgetDefinition, context: WidgetContext): boolean {
  return widget.requiredContext.every((req) => hasWidgetContextRequirement(context, req));
}

/**
 * Resuelve visibilidad y si el widget puede iniciar consultas.
 * Un widget oculto o no autorizado nunca debe hacer fetch.
 */
export function resolveWidgetVisibility(
  widget: WidgetDefinition,
  context: WidgetContext,
): WidgetVisibility {
  const permission = validateWidgetPermission(widget, context.role);

  if (!permission.allowed) {
    return {
      widgetId: widget.id,
      visible: false,
      shouldFetch: false,
      presentation: 'hidden',
      reason: 'forbidden',
    };
  }

  if (widget.category === 'dashboard' && context.surface === 'command-center') {
    return {
      widgetId: widget.id,
      visible: false,
      shouldFetch: false,
      presentation: 'hidden',
      reason: 'dashboard-not-on-home',
    };
  }

  if (widget.hiddenByDefault && !isExplicitlyShown(widget, context)) {
    return {
      widgetId: widget.id,
      visible: false,
      shouldFetch: false,
      presentation: 'hidden',
      reason: 'hidden-by-default',
    };
  }

  if (!hasRequiredContext(widget, context)) {
    return {
      widgetId: widget.id,
      visible: false,
      shouldFetch: false,
      presentation: 'hidden',
      reason: 'missing-context',
    };
  }

  return {
    widgetId: widget.id,
    visible: true,
    shouldFetch: true,
    presentation: context.offline ? 'offline' : 'ready',
    reason: 'allowed',
  };
}

export function resolveVisibleWidgets(
  definitions: readonly WidgetDefinition[],
  context: WidgetContext,
): WidgetVisibility[] {
  return definitions.map((widget) => resolveWidgetVisibility(widget, context));
}

export function filterFetchableWidgetIds(
  definitions: readonly WidgetDefinition[],
  context: WidgetContext,
): string[] {
  return resolveVisibleWidgets(definitions, context)
    .filter((v) => v.shouldFetch)
    .map((v) => v.widgetId);
}
