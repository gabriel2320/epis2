import type { CicaScreenBlueprint } from '@epis2/epis2-ui';

const actionFormWithAssist = [
  { id: 'assist', span: 12 as const },
  { id: 'form', span: 12 as const },
  { id: 'status', span: 12 as const },
];

const actionFormOnly = [
  { id: 'form', span: 12 as const },
  { id: 'status', span: 12 as const },
];

/** Nueva evolución SOAP — asistencia IA + formulario scrollspy + estado. */
export const NEW_EVOLUTION_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'new-evolution',
  hideActionBar: false,
  sections: actionFormWithAssist,
};

/** Nuevo certificado / documento — formulario + estado. */
export const NEW_DOCUMENT_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'new-document',
  hideActionBar: false,
  sections: actionFormOnly,
};

/** Nueva receta / indicación — asistencia IA + formulario + estado. */
export const NEW_PRESCRIPTION_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'new-prescription',
  hideActionBar: false,
  sections: actionFormWithAssist,
};

/** Nueva epicrisis — asistencia IA + formulario + estado. */
export const NEW_EPICRISIS_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'new-epicrisis',
  hideActionBar: false,
  sections: actionFormWithAssist,
};

/** Libro evoluciones — pager + cuerpo carta (lectura). */
export const EVOLUTION_BOOK_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'evolution-book',
  hideActionBar: true,
  sections: [
    { id: 'meta', span: 12 },
    { id: 'body', span: 12 },
  ],
};

/** Libro evoluciones vacío — mensaje único. */
export const EVOLUTION_BOOK_EMPTY_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'evolution-book',
  hideActionBar: true,
  sections: [{ id: 'main', span: 12 }],
};

/** Detalle evolución — meta + cuerpo carta. */
export const EVOLUTION_DETAIL_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'evolution-detail',
  hideActionBar: true,
  sections: [
    { id: 'meta', span: 12 },
    { id: 'body', span: 12 },
  ],
};

/** Detalle evolución no encontrada. */
export const EVOLUTION_DETAIL_EMPTY_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'evolution-detail',
  hideActionBar: true,
  sections: [{ id: 'main', span: 12 }],
};
