/** Datos sintéticos WIDGET-00 — sin PHI real ni integración clínica. */

export type DemoPatientContext = {
  patientId: string;
  displayName: string;
  demoCaseCode: string;
  ageYears: number;
  activeEncounter: string;
};

export type DemoDraftRow = {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
};

export type DemoWorkItem = {
  id: string;
  label: string;
  priority: 'normal' | 'preferente';
};

export const DEMO_PATIENT_CONTEXT: DemoPatientContext = {
  patientId: 'demo-patient-001',
  displayName: 'Paciente Demo Aurora',
  demoCaseCode: 'DEMO-001',
  ageYears: 58,
  activeEncounter: 'Consulta externa — cardiología',
};

export const DEMO_PENDING_DRAFTS: DemoDraftRow[] = [
  {
    id: 'draft-evo-01',
    title: 'Evolución médica pendiente',
    status: 'borrador',
    updatedAt: '2026-06-04T10:30:00',
  },
  {
    id: 'draft-rx-02',
    title: 'Receta en revisión',
    status: 'listo_para_revision',
    updatedAt: '2026-06-04T09:15:00',
  },
];

export const DEMO_PATIENT_SUMMARY = {
  headline: 'Resumen clínico demo',
  highlights: [
    'Hipertensión arterial en seguimiento',
    'Alergia documentada a penicilina',
    'Última consulta hace 7 días',
  ],
};

export const DEMO_ACTIVE_PROBLEMS = [
  'Hipertensión arterial esencial',
  'Dislipidemia mixta',
  'Dolor torácico atípico — estudio en curso',
];

export const DEMO_RECENT_LABS = [
  { code: 'GLU', label: 'Glucosa', value: '98 mg/dL', collectedAt: '2026-06-02' },
  { code: 'LDL', label: 'LDL colesterol', value: '132 mg/dL', collectedAt: '2026-06-02' },
  { code: 'TSH', label: 'TSH', value: '2.1 mUI/L', collectedAt: '2026-05-28' },
];

export const DEMO_MY_WORK: DemoWorkItem[] = [
  { id: 'work-1', label: 'Revisar borrador de evolución', priority: 'preferente' },
  { id: 'work-2', label: 'Validar receta demo', priority: 'normal' },
  { id: 'work-3', label: 'Completar nota de enfermería', priority: 'normal' },
];
