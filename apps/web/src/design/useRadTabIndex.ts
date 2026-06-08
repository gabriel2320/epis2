import { useCallback, useRef } from 'react';
import { EPIS_RAD_TABINDEX } from './radDiscipline.js';

/**
 * TabIndex lógico estilo VB — región fija + incremento por campo.
 */
export function useRadTabIndex(region: keyof typeof EPIS_RAD_TABINDEX = 'formFields') {
  const counter = useRef(0);
  counter.current = 0;

  const next = useCallback(() => {
    const value = EPIS_RAD_TABINDEX[region] + counter.current;
    counter.current += 1;
    return value;
  }, [region]);

  const reset = useCallback(() => {
    counter.current = 0;
  }, []);

  return { next, reset, base: EPIS_RAD_TABINDEX[region] };
}
