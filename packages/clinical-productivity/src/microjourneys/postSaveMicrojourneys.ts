/** MF-DI-09 — acciones determinísticas tras guardar borrador clínico. */

export type PostSaveMicrojourneyAction = {
  id: string;
  labelEs: string;
  routePath: string;
  search?: Record<string, string>;
  testId: string;
};

export type PostSaveMicrojourneyInput = {
  blueprintId: string;
  patientId?: string | undefined;
  summaryFields?: Record<string, string> | undefined;
};

const DM2_LAB_PANEL =
  'HbA1c\nGlucosa en ayunas\nCreatinina\nPerfil lipídico (LDL, HDL, triglicéridos)\nMicroalbuminuria en orina';

const HTA_LAB_PANEL = 'Creatinina\nElectrolitos\nPerfil lipídico\nOrina completa';

function detectChronicFocus(summaryFields?: Record<string, string>): 'dm2' | 'hta' | null {
  const blob = [
    summaryFields?.activeProblems,
    summaryFields?.activeMedications,
    summaryFields?.relevantLabs,
  ]
    .filter(Boolean)
    .join(' ')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
  if (/diabetes|dm2|\bdm\b|glicemia|hba1c|metformina/i.test(blob)) return 'dm2';
  if (/hipertension|\bhta\b|losartan|enalapril/i.test(blob)) return 'hta';
  return null;
}

function frequentLabPanel(summaryFields?: Record<string, string>): string {
  const focus = detectChronicFocus(summaryFields);
  if (focus === 'dm2') return DM2_LAB_PANEL;
  if (focus === 'hta') return HTA_LAB_PANEL;
  return 'Hemograma\nCreatinina\nGlucosa en ayunas';
}

export function resolvePostSaveMicrojourneys(
  input: PostSaveMicrojourneyInput,
): PostSaveMicrojourneyAction[] {
  const { blueprintId, patientId, summaryFields } = input;
  if (!patientId) return [];

  switch (blueprintId) {
    case 'prescription':
      return [
        {
          id: 'print_rx',
          labelEs: 'Imprimir receta',
          routePath: '/espacio/receta/imprimir',
          search: { patientId },
          testId: 'epis2-microjourney-print-rx',
        },
        {
          id: 'view_history',
          labelEs: 'Ver historial clínico',
          routePath: '/espacio/ficha',
          search: { patientId, chartMode: 'traditional' },
          testId: 'epis2-microjourney-view-history',
        },
      ];
    case 'evolution_note':
      return [
        {
          id: 'linked_rx',
          labelEs: 'Crear receta asociada',
          routePath: '/espacio/receta',
          search: { patientId },
          testId: 'epis2-microjourney-linked-rx',
        },
      ];
    case 'lab_request':
      return [
        {
          id: 'frequent_panel',
          labelEs: 'Solicitar panel frecuente por diagnóstico',
          routePath: '/espacio/laboratorio',
          search: {
            patientId,
            studyHint: frequentLabPanel(summaryFields),
            clinicalReasonHint:
              detectChronicFocus(summaryFields) === 'dm2'
                ? 'Control diabetes mellitus tipo 2'
                : detectChronicFocus(summaryFields) === 'hta'
                  ? 'Control hipertensión arterial'
                  : 'Control crónico',
          },
          testId: 'epis2-microjourney-frequent-panel',
        },
      ];
    default:
      return [];
  }
}
