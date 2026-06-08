/**
 * Modo diseño — solo desarrollo / flag explícito.
 * No altera flujo clínico ni persiste datos.
 */
export function isDesignModeEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_DESIGN_MODE;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return false;
}
