export const WIDGET_LAYOUT_SCHEMA_VERSION = 1 as const;

export type WidgetLayoutExportDocument = {
  schemaVersion: typeof WIDGET_LAYOUT_SCHEMA_VERSION;
  surface: string;
  widgetIds: readonly string[];
  exportedAt: string;
};

export type WidgetLayoutImportResult =
  | { ok: true; document: WidgetLayoutExportDocument }
  | { ok: false; errors: string[] };

export function serializeWidgetLayoutToJson(
  surface: string,
  widgetIds: readonly string[],
  pretty = true,
): string {
  const document: WidgetLayoutExportDocument = {
    schemaVersion: WIDGET_LAYOUT_SCHEMA_VERSION,
    surface,
    widgetIds: [...widgetIds],
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(document, null, pretty ? 2 : undefined);
}

export function parseWidgetLayoutImport(
  raw: string,
  expectedSurface?: string,
): WidgetLayoutImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, errors: ['JSON inválido'] };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, errors: ['Documento raíz debe ser un objeto'] };
  }

  const record = parsed as Record<string, unknown>;
  const surface = typeof record.surface === 'string' ? record.surface : '';
  const widgetIds = Array.isArray(record.widgetIds)
    ? record.widgetIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
    : [];

  const errors: string[] = [];
  if (!surface) errors.push('surface requerido');
  if (widgetIds.length === 0) errors.push('widgetIds debe ser un array no vacío');
  if (expectedSurface && surface !== expectedSurface) {
    errors.push(`surface esperado ${expectedSurface}, recibido ${surface || '—'}`);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    document: {
      schemaVersion: WIDGET_LAYOUT_SCHEMA_VERSION,
      surface,
      widgetIds,
      exportedAt:
        typeof record.exportedAt === 'string' ? record.exportedAt : new Date().toISOString(),
    },
  };
}

export function applyWidgetLayoutOrder<T extends { id: string }>(
  items: readonly T[],
  preferredOrder: readonly string[] | undefined,
): T[] {
  if (!preferredOrder || preferredOrder.length === 0) return [...items];
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered: T[] = [];
  for (const id of preferredOrder) {
    const item = byId.get(id);
    if (item) {
      ordered.push(item);
      byId.delete(id);
    }
  }
  for (const item of byId.values()) {
    ordered.push(item);
  }
  return ordered;
}
