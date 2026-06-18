import type { CicaScreenBlueprint } from '@epis2/epis2-ui';

/** Índice libro clínico / modo papel. */
export const PAPER_BOOK_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'paper-book',
  hideActionBar: true,
  sections: [
    { id: 'intro', span: 12 },
    { id: 'actions', span: 12 },
  ],
};
