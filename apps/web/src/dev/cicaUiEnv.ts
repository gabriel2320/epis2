/** CICA — interfaz visual React + MD3 (ficha clásica + modo papel). */

/** Veredicto producto — ver reports/epis2-cica-classic-implementation-roadmap.md */
export type CicaUiProductStatus = 'no-go' | 'go';

export const CICA_UI_PRODUCT_STATUS: CicaUiProductStatus = 'go';

/** Activo con producto GO; opt-out dev: `VITE_DISABLE_CICA_UI=true`. */
export function isCicaUiEnabled(): boolean {
  if (import.meta.env.VITE_DISABLE_CICA_UI === 'true') return false;
  if (CICA_UI_PRODUCT_STATUS === 'go') return true;
  return import.meta.env.VITE_ENABLE_CICA_UI === 'true';
}

export function isCicaProductReady(): boolean {
  return CICA_UI_PRODUCT_STATUS === 'go';
}
