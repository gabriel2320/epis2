/** Secciones ficha dual — contenido demo curado (MF-NORM-06 / MF-TE-02). */
export const DEMO_CHART_PRIORITY_SECTIONS = [
  'navAllergies',
  'navMeds',
  'navOrders',
  'navLabs',
  'navEvolution',
] as const;

export type DemoChartPrioritySectionId = (typeof DEMO_CHART_PRIORITY_SECTIONS)[number];

export type DemoChartSectionRow = {
  label: string;
  value: string;
};

export type DemoChartSectionContent = Partial<
  Record<DemoChartPrioritySectionId, readonly DemoChartSectionRow[]>
>;

const FORBIDDEN = /\b(TODO|lorem ipsum|FIXME)\b/i;

/** Filas demo por código — alineado a escenarios EPIS2-09. */
export const DEMO_CHART_SECTIONS_BY_CODE: Record<string, DemoChartSectionContent> = {
  'DEMO-001': {
    navAllergies: [{ label: 'Estado', value: 'Sin alergias medicamentosas conocidas (demo)' }],
    navMeds: [{ label: 'Losartán', value: '50 mg · VO · 1-0-0 (demo)' }],
    navOrders: [{ label: 'Control', value: 'PA ambulatoria en 7 días (demo)' }],
    navLabs: [
      { label: 'Creatinina', value: '0.9 mg/dL · 2026-06-01 (sintético)' },
      { label: 'Hb', value: '14 g/dL · 2026-06-01 (sintético)' },
    ],
    navEvolution: [{ label: '2026-06-10', value: 'Control HTA estable — plan ambulatorio (demo)' }],
  },
  'DEMO-002': {
    navAllergies: [{ label: 'Estado', value: 'Sin alergias documentadas (demo)' }],
    navMeds: [
      { label: 'Metformina', value: '850 mg · VO · c/12 h (demo)' },
      { label: 'Atorvastatina', value: '20 mg · VO · noche (demo)' },
    ],
    navOrders: [
      { label: 'Curación', value: 'Curación pie diabético c/48 h (demo)' },
      { label: 'Lab', value: 'HbA1c control en 3 meses (demo)' },
    ],
    navLabs: [
      { label: 'HbA1c', value: '7.4 % · 2026-05-20 (sintético)' },
      { label: 'LDL', value: '118 mg/dL · 2026-05-20 (sintético)' },
    ],
    navEvolution: [
      { label: '2026-06-09', value: 'Úlcera plantar en control — sin signos infección (demo)' },
    ],
  },
  'DEMO-003': {
    navAllergies: [{ label: 'Polen', value: 'Estacional leve · activa (demo)' }],
    navMeds: [{ label: 'Budesonida/formoterol', value: 'Inhalador · SOS (demo pediátrico)' }],
    navOrders: [{ label: 'Control', value: 'Pediatría en 4 semanas (demo)' }],
    navLabs: [
      { label: 'SatO2', value: '98 % · 2026-06-08 (sintético)' },
      { label: 'Peso', value: '22 kg · 2026-06-08 (sintético)' },
    ],
    navEvolution: [
      { label: '2026-06-08', value: 'Asma controlada — técnica inhalatoria correcta (demo)' },
    ],
  },
  'DEMO-004': {
    navAllergies: [{ label: 'Estado', value: 'Sin alergias conocidas (demo)' }],
    navMeds: [
      { label: 'Paracetamol', value: '1 g · VO · c/8 h (demo)' },
      { label: 'Profilaxis ATB', value: 'Finalizada postoperatorio (demo)' },
    ],
    navOrders: [
      { label: 'Monitorización', value: 'Signos vitales c/4 h (demo)' },
      { label: 'Alta', value: 'Prevista 48 h si evolución favorable (demo)' },
    ],
    navLabs: [
      { label: 'Leucocitos', value: '9.2 ×10³/µL · 2026-06-10 (sintético)' },
      { label: 'PCR', value: '12 mg/L · 2026-06-10 (sintético)' },
    ],
    navEvolution: [{ label: '2026-06-10', value: 'Postoperatorio día 2 — tolera vía oral (demo)' }],
  },
  'DEMO-005': {
    navAllergies: [{ label: 'Penicilina', value: 'Anafilaxia · severa · activa (demo)' }],
    navMeds: [
      { label: 'Warfarina', value: '5 mg · VO · día (demo)' },
      { label: 'Ceftriaxona', value: '1 g · IV · c/24 h (demo — revisar alergia)' },
    ],
    navOrders: [
      { label: 'Hemocultivos', value: 'Control 48 h post ATB (demo)' },
      { label: 'Cardiología', value: 'Interconsulta FA descompensada (demo)' },
    ],
    navLabs: [
      { label: 'INR', value: '2.4 · 2026-06-09 (sintético)' },
      { label: 'Creatinina', value: '1.1 mg/dL · 2026-06-09 (sintético)' },
    ],
    navEvolution: [{ label: '2026-06-09', value: 'Fiebre en descenso — ceftriaxona día 2 (demo)' }],
  },
};

export const DEMO_CHART_BATCH2_SECTIONS = [
  'navAnamnesis',
  'navPhysicalExam',
  'navDiagnoses',
  'navImaging',
  'navConsults',
] as const;

export type DemoChartBatch2SectionId = (typeof DEMO_CHART_BATCH2_SECTIONS)[number];

export type DemoChartBatch2Content = Partial<
  Record<DemoChartBatch2SectionId, readonly DemoChartSectionRow[]>
>;

const BATCH2_BY_CODE: Record<string, DemoChartBatch2Content> = {
  'DEMO-001': {
    navAnamnesis: [{ label: 'Motivo', value: 'Control HTA — asintomático (demo)' }],
    navPhysicalExam: [{ label: 'PA', value: '128/82 mmHg · regular (demo)' }],
    navDiagnoses: [{ label: 'Principal', value: 'Hipertensión esencial (demo)' }],
    navImaging: [{ label: 'ECG', value: 'Ritmo sinusal — sin cambios (demo)' }],
    navConsults: [{ label: 'Estado', value: 'Sin interconsultas pendientes (demo)' }],
  },
  'DEMO-002': {
    navAnamnesis: [{ label: 'Motivo', value: 'Control pie diabético (demo)' }],
    navPhysicalExam: [{ label: 'Pie', value: 'Úlcera plantar grado 1 — sin secreción (demo)' }],
    navDiagnoses: [{ label: 'Principal', value: 'DM2 descompensada leve (demo)' }],
    navImaging: [{ label: 'Rx pie', value: 'Sin osteomielitis (demo)' }],
    navConsults: [{ label: 'Podología', value: 'Derivación ambulatoria (demo)' }],
  },
  'DEMO-003': {
    navAnamnesis: [{ label: 'Motivo', value: 'Control asma pediátrica (demo)' }],
    navPhysicalExam: [{ label: 'Pulmones', value: 'Murmullo vesicular conservado (demo)' }],
    navDiagnoses: [{ label: 'Principal', value: 'Asma persistente leve (demo)' }],
    navImaging: [{ label: 'Rx tórax', value: 'Sin infiltrados (demo)' }],
    navConsults: [{ label: 'Pediatría', value: 'Control en 4 semanas (demo)' }],
  },
  'DEMO-004': {
    navAnamnesis: [{ label: 'Motivo', value: 'Postoperatorio apendicectomía (demo)' }],
    navPhysicalExam: [{ label: 'Abdomen', value: 'Blando — herida seca (demo)' }],
    navDiagnoses: [{ label: 'Principal', value: 'Apendicitis resuelta (demo)' }],
    navImaging: [{ label: 'Rx tórax', value: 'Sin condensación (demo)' }],
    navConsults: [{ label: 'Cirugía', value: 'Visita post alta (demo)' }],
  },
  'DEMO-005': {
    navAnamnesis: [{ label: 'Motivo', value: 'Fiebre en estudio — bacteriemia (demo)' }],
    navPhysicalExam: [
      { label: 'General', value: 'Febril 38.1 °C — hemodinámicamente estable (demo)' },
    ],
    navDiagnoses: [{ label: 'Principal', value: 'Bacteriemia en evaluación (demo)' }],
    navImaging: [{ label: 'Eco cardio', value: 'Solicitada — pendiente (demo)' }],
    navConsults: [{ label: 'Cardiología', value: 'Interconsulta FA (demo)' }],
  },
};

export function getDemoChartBatch2Rows(
  demoCaseCode: string | undefined,
  sectionId: DemoChartBatch2SectionId,
): readonly DemoChartSectionRow[] {
  if (!demoCaseCode) return [];
  return BATCH2_BY_CODE[demoCaseCode]?.[sectionId] ?? [];
}

export const DEMO_CHART_BATCH3_SECTIONS = [
  'navAdmin',
  'navDocuments',
  'navEpicrisis',
  'navProcedures',
  'navAudit',
] as const;

export type DemoChartBatch3SectionId = (typeof DEMO_CHART_BATCH3_SECTIONS)[number];

export type DemoChartDemoSectionId = DemoChartBatch2SectionId | DemoChartBatch3SectionId;

const BATCH3_BY_CODE: Record<
  string,
  Partial<Record<DemoChartBatch3SectionId, readonly DemoChartSectionRow[]>>
> = {
  'DEMO-001': {
    navAdmin: [{ label: 'Previsión', value: 'FONASA · ambulatorio (demo)' }],
    navDocuments: [{ label: 'Consentimiento', value: 'No requerido — control (demo)' }],
    navEpicrisis: [{ label: 'Estado', value: 'No aplica — ambulatorio (demo)' }],
    navProcedures: [{ label: 'Estado', value: 'Sin procedimientos (demo)' }],
    navAudit: [{ label: 'Último acceso', value: 'Médico demo · 2026-06-10 (demo)' }],
  },
  'DEMO-002': {
    navAdmin: [{ label: 'Previsión', value: 'ISAPRE · control crónico (demo)' }],
    navDocuments: [{ label: 'Informe pie', value: 'PDF demo indexado (demo)' }],
    navEpicrisis: [{ label: 'Estado', value: 'Epicrisis no indicada (demo)' }],
    navProcedures: [{ label: 'Curación', value: 'Curación ambulatoria (demo)' }],
    navAudit: [{ label: 'Farmacia', value: 'Revisión interacciones pendiente (demo)' }],
  },
  'DEMO-003': {
    navAdmin: [{ label: 'Tutor', value: 'Madre — contacto demo (demo)' }],
    navDocuments: [{ label: 'Plan asma', value: 'Plan de acción entregado (demo)' }],
    navEpicrisis: [{ label: 'Estado', value: 'No aplica (demo)' }],
    navProcedures: [{ label: 'Estado', value: 'Sin procedimientos (demo)' }],
    navAudit: [{ label: 'Pediatría', value: 'Control 4 semanas (demo)' }],
  },
  'DEMO-004': {
    navAdmin: [{ label: 'Cama', value: 'C-204 · cirugía (demo)' }],
    navDocuments: [{ label: 'Consentimiento IQ', value: 'Firmado — demo (demo)' }],
    navEpicrisis: [{ label: 'Borrador', value: 'Epicrisis pendiente alta (demo)' }],
    navProcedures: [{ label: 'Apendicectomía', value: '2026-06-08 — laparoscópica (demo)' }],
    navAudit: [{ label: 'Enfermería', value: 'Signos vitales c/4 h (demo)' }],
  },
  'DEMO-005': {
    navAdmin: [{ label: 'Previsión', value: 'FONASA · hospitalizado (demo)' }],
    navDocuments: [{ label: 'Hemocultivos', value: 'Informe preliminar (demo)' }],
    navEpicrisis: [{ label: 'Estado', value: 'Hospitalización en curso (demo)' }],
    navProcedures: [{ label: 'Estado', value: 'Sin procedimientos (demo)' }],
    navAudit: [{ label: 'Infectología', value: 'Seguimiento ATB día 2 (demo)' }],
  },
};

export function getDemoChartBatch3Rows(
  demoCaseCode: string | undefined,
  sectionId: DemoChartBatch3SectionId,
): readonly DemoChartSectionRow[] {
  if (!demoCaseCode) return [];
  return BATCH3_BY_CODE[demoCaseCode]?.[sectionId] ?? [];
}

export function getDemoChartDemoSectionRows(
  demoCaseCode: string | undefined,
  sectionId: DemoChartDemoSectionId,
): readonly DemoChartSectionRow[] {
  if ((DEMO_CHART_BATCH2_SECTIONS as readonly string[]).includes(sectionId)) {
    return getDemoChartBatch2Rows(demoCaseCode, sectionId as DemoChartBatch2SectionId);
  }
  return getDemoChartBatch3Rows(demoCaseCode, sectionId as DemoChartBatch3SectionId);
}

export function getDemoChartSectionRows(
  demoCaseCode: string | undefined,
  sectionId: DemoChartPrioritySectionId,
): readonly DemoChartSectionRow[] {
  if (!demoCaseCode) return [];
  return DEMO_CHART_SECTIONS_BY_CODE[demoCaseCode]?.[sectionId] ?? [];
}

/** Sección visible en ficha demo — oculta vacías (MF-NORM-10). */
export function hasDemoTraditionalSectionContent(
  demoCaseCode: string | undefined,
  sectionId: string,
): boolean {
  if (!demoCaseCode) return true;
  if (sectionId === 'navSummary') return true;
  if (sectionId === 'navAntecedents') return false;
  if ((DEMO_CHART_PRIORITY_SECTIONS as readonly string[]).includes(sectionId)) {
    return (
      getDemoChartSectionRows(demoCaseCode, sectionId as DemoChartPrioritySectionId).length > 0
    );
  }
  if (
    (DEMO_CHART_BATCH2_SECTIONS as readonly string[]).includes(sectionId) ||
    (DEMO_CHART_BATCH3_SECTIONS as readonly string[]).includes(sectionId)
  ) {
    return (
      getDemoChartDemoSectionRows(demoCaseCode, sectionId as DemoChartDemoSectionId).length > 0
    );
  }
  return false;
}

export function assertDemoChartSectionsInvariants(): string[] {
  const errors: string[] = [];
  const codes = ['DEMO-001', 'DEMO-002', 'DEMO-003', 'DEMO-004', 'DEMO-005'];
  for (const code of codes) {
    const content = DEMO_CHART_SECTIONS_BY_CODE[code];
    if (!content) {
      errors.push(`Falta contenido chart para ${code}`);
      continue;
    }
    for (const sectionId of DEMO_CHART_PRIORITY_SECTIONS) {
      const rows = content[sectionId];
      if (!rows?.length) {
        errors.push(`${code} sin filas en ${sectionId}`);
        continue;
      }
      for (const row of rows) {
        if (FORBIDDEN.test(row.label) || FORBIDDEN.test(row.value)) {
          errors.push(`${code}/${sectionId}: texto prohibido`);
        }
        if (!row.value.includes('demo') && !row.value.includes('sintético')) {
          errors.push(`${code}/${sectionId}: fila sin marca demo/sintético`);
        }
      }
    }
  }
  return errors;
}
