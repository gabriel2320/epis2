/** Catálogo visual M3 (THEME-07) — solo desarrollo o flag explícito. */
export function isVisualThemeCatalogEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_VISUAL_THEME_CATALOG;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return import.meta.env.DEV;
}
