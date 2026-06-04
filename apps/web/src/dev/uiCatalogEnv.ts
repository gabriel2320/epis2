/** Catálogo UI solo desarrollo o con flag explícito (MUI-02). */
export function isUiCatalogEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_UI_CATALOG;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return import.meta.env.DEV;
}
