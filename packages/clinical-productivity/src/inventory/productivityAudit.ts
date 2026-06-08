/** Inventario MF-CLINICAL-PRODUCTIVITY — auditoría estática. */
export type ProductivityGap =
  | 'free_text_heavy'
  | 'missing_grid'
  | 'duplicate_actions'
  | 'missing_autocomplete'
  | 'missing_bulk'
  | 'long_form_scroll';

export type ProductivityScreenAudit = {
  route: string;
  primaryTask: string;
  gaps: readonly ProductivityGap[];
  phase: 'A' | 'B' | 'C' | 'D' | 'E';
  utility: readonly string[];
};

export const PRODUCTIVITY_SCREEN_AUDIT: readonly ProductivityScreenAudit[] = [
  {
    route: '/comando',
    primaryTask: 'Decidir intención',
    gaps: [],
    phase: 'A',
    utility: ['ClinicalCommandPalette'],
  },
  {
    route: '/espacio/buscar-paciente',
    primaryTask: 'Buscar paciente',
    gaps: ['missing_autocomplete'],
    phase: 'A',
    utility: ['ClinicalAutocomplete', 'ClinicalDataGrid'],
  },
  {
    route: '/espacio/evolucion',
    primaryTask: 'Registrar evolución',
    gaps: ['free_text_heavy', 'long_form_scroll'],
    phase: 'B',
    utility: ['ClinicalRichTextEditor', 'ClinicalSnippetExpander', 'ClinicalSpellCheck'],
  },
  {
    route: '/espacio/ficha',
    primaryTask: 'Contexto paciente',
    gaps: ['missing_grid'],
    phase: 'A',
    utility: ['ClinicalCopyPasteTools', 'ClinicalSemanticSearchBox'],
  },
  {
    route: '/epis2/dashboard?tab=work',
    primaryTask: 'Pendientes',
    gaps: ['missing_grid', 'missing_bulk', 'duplicate_actions'],
    phase: 'A',
    utility: ['ClinicalDataGrid', 'ClinicalBulkActionMenu'],
  },
  {
    route: '/epis2/dashboard?tab=pharmacy',
    primaryTask: 'Cola farmacia',
    gaps: ['missing_grid', 'missing_bulk'],
    phase: 'A',
    utility: ['ClinicalDataGrid', 'ClinicalBulkActionMenu'],
  },
  {
    route: '/espacio/resultados',
    primaryTask: 'Bandeja resultados',
    gaps: ['missing_bulk'],
    phase: 'A',
    utility: ['ClinicalDataGrid', 'ClinicalBulkActionMenu'],
  },
  {
    route: '/espacio/borrador/:id',
    primaryTask: 'Aprobar borrador',
    gaps: ['duplicate_actions'],
    phase: 'A',
    utility: ['ClinicalCopyPasteTools'],
  },
];
