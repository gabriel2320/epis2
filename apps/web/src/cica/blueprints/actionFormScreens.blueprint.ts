import type { CicaScreenBlueprint } from '@epis2/epis2-ui';

/** Nueva evolución SOAP — asistencia IA + formulario scrollspy + estado. */
export const NEW_EVOLUTION_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'new-evolution',
  hideActionBar: false,
  sections: [
    { id: 'assist', span: 12 },
    { id: 'form', span: 12 },
    { id: 'status', span: 12 },
  ],
};
