import type { WidgetDefinition } from '../contracts/widget-definition.js';
import { DEMO_WIDGET_DEFINITIONS } from './demo-widget-definitions.js';
import { validateWidgetRegistry } from './widget-registry-gates.js';

/** Único registry canónico de widgets EPIS2 (WIDGET-00). */
const REGISTRY: readonly WidgetDefinition[] = DEMO_WIDGET_DEFINITIONS;

const gate = validateWidgetRegistry(REGISTRY);
if (!gate.ok) {
  throw new Error(`Widget registry inválido:\n${gate.details.join('\n')}`);
}

export const EPIS2_WIDGET_REGISTRY: readonly WidgetDefinition[] = REGISTRY;

export function getWidgetById(id: string): WidgetDefinition | undefined {
  return EPIS2_WIDGET_REGISTRY.find((w) => w.id === id);
}

export function listWidgets(): readonly WidgetDefinition[] {
  return EPIS2_WIDGET_REGISTRY;
}

export function listWidgetsByCategory(
  category: WidgetDefinition['category'],
): readonly WidgetDefinition[] {
  return EPIS2_WIDGET_REGISTRY.filter((w) => w.category === category);
}
