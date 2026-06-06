import { useCallback, useMemo } from 'react';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';
import { applyWidgetLayoutOrder } from './widget-layout-io.js';

export function useWidgetLayoutOrder(surface: string) {
  const { preferences, setPreferences } = useEpis2ThemePreferences();

  const order = preferences.widgetLayoutOrder?.[surface];

  const setOrder = useCallback(
    (widgetIds: readonly string[]) => {
      setPreferences({
        widgetLayoutOrder: {
          ...preferences.widgetLayoutOrder,
          [surface]: [...widgetIds],
        },
      });
    },
    [preferences.widgetLayoutOrder, setPreferences, surface],
  );

  const sortByPreference = useCallback(
    <T extends { id: string }>(items: readonly T[]) => applyWidgetLayoutOrder(items, order),
    [order],
  );

  return useMemo(
    () => ({
      order: order ?? [],
      setOrder,
      sortByPreference,
    }),
    [order, setOrder, sortByPreference],
  );
}
