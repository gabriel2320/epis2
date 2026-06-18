import type { CicaScreenBlueprint } from '@epis2/epis2-ui';

export const PATIENT_SEARCH_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-search',
  hideActionBar: true,
  sections: [
    { id: 'hero', span: 12 },
    { id: 'search', span: 12 },
    { id: 'results', span: 12 },
  ],
};

export const CENSUS_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'census',
  hideActionBar: true,
  sections: [
    { id: 'intro', span: 12 },
    { id: 'filter', span: 12 },
    { id: 'list', span: 12 },
  ],
};

export function stubPatientBlueprint(
  screenId: CicaScreenBlueprint['screenId'],
  placeholder: string,
): CicaScreenBlueprint {
  return {
    screenId,
    hideActionBar: true,
    sections: [{ id: 'main', span: 12, placeholder }],
  };
}

export const RECENT_PATIENTS_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'recent-patients',
  hideActionBar: true,
  sections: [
    {
      id: 'main',
      span: 12,
      placeholder: 'Lista de recientes — conectar con historial local en siguiente iteración.',
    },
  ],
};

export const MY_WORK_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'my-work',
  hideActionBar: true,
  sections: [
    {
      id: 'main',
      span: 12,
      placeholder: 'Bandeja personal — borradores, firmas y tareas clínicas pendientes.',
    },
  ],
};

export const AGENDA_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'agenda',
  hideActionBar: true,
  sections: [
    {
      id: 'main',
      span: 12,
      placeholder: 'Vista agenda — calendario de guardia en demo próximo.',
    },
  ],
};
