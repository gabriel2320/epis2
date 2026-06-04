/**
 * Claves de formularios / UI que no deben aparecer en recursos FHIR exportados.
 */
export const UI_ONLY_EXPORT_KEYS = new Set([
  'activeProblems',
  'recentEvents',
  'relevantLabs',
  'activeMedications',
  'pendingItems',
  'clinicalAlerts',
  'blueprintId',
  'demoBadge',
  'demoLabel',
  'routePath',
  'summaryFields',
  'powerBarLabel',
  'allowedRoles',
  'outputKind',
]);

export function findUiOnlyKeys(value: unknown, path = ''): string[] {
  const hits: string[] = [];
  if (value === null || value === undefined) return hits;
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      hits.push(...findUiOnlyKeys(item, `${path}[${i}]`));
    });
    return hits;
  }
  if (typeof value === 'object') {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (UI_ONLY_EXPORT_KEYS.has(key)) {
        hits.push(path ? `${path}.${key}` : key);
      }
      hits.push(...findUiOnlyKeys(child, path ? `${path}.${key}` : key));
    }
  }
  return hits;
}
