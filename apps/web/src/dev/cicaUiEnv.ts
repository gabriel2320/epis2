/** CICA Clean Room UI — default ON (opt-out con VITE_ENABLE_CICA_UI=false). */
export function isCicaUiEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_CICA_UI;
  if (flag === 'false') return false;
  return true;
}
