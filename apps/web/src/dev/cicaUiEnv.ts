/** CICA Clean Room — laboratorio NO-GO; no activar en piloto sin reformulación CICA-L. */

/** Veredicto producto — ver reports/epis2-frontend-purge-cica-reform-plan.md */
export type CicaUiProductStatus = 'no-go' | 'go';

export const CICA_UI_PRODUCT_STATUS: CicaUiProductStatus = 'no-go';

/** Opt-in explícito: solo `VITE_ENABLE_CICA_UI=true` activa `/app/*`. Default = legacy `/espacio/*`. */
export function isCicaUiEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_CICA_UI === 'true';
}

export function isCicaProductReady(): boolean {
  return CICA_UI_PRODUCT_STATUS === 'go';
}
