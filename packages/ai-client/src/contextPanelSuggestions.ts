/** Acción sugerida en panel lateral ficha (MF-CM-05 / MF-FF-11). */
export type ContextPanelSuggestion = {
  intent: string;
  labelEs: string;
  commandText: string;
};

export type ContextPanelSuggestionsInput = {
  role: string;
  aiAvailable: boolean;
  activeAlertCount?: number | undefined;
  pendingDraftCount?: number | undefined;
  traditionalSection?: string | undefined;
};

type SuggestionSeed = ContextPanelSuggestion & { roles: readonly string[] };

const BASE_SUGGESTIONS: readonly SuggestionSeed[] = [
  {
    intent: 'summarize_patient',
    labelEs: 'Resumir paciente',
    commandText: 'resumir paciente',
    roles: ['physician', 'nurse', 'pharmacist'],
  },
  {
    intent: 'create_evolution_draft',
    labelEs: 'Evolución',
    commandText: 'evolucionar paciente',
    roles: ['physician', 'kinesiologist'],
  },
  {
    intent: 'open_results_inbox',
    labelEs: 'Revisar resultados',
    commandText: 'revisar resultados pendientes',
    roles: ['physician', 'nurse'],
  },
  {
    intent: 'reconcile_medications',
    labelEs: 'Conciliar medicamentos',
    commandText: 'conciliacion medicamentosa',
    roles: ['physician', 'pharmacist', 'nurse'],
  },
  {
    intent: 'prepare_pharmacy_review',
    labelEs: 'Validación farmacia',
    commandText: 'validacion farmaceutica',
    roles: ['pharmacist', 'physician'],
  },
  {
    intent: 'request_laboratory',
    labelEs: 'Solicitar laboratorio',
    commandText: 'solicitar laboratorio',
    roles: ['physician'],
  },
  {
    intent: 'prepare_prescription',
    labelEs: 'Receta',
    commandText: 'preparar receta',
    roles: ['physician', 'pharmacist'],
  },
  {
    intent: 'create_nursing_note',
    labelEs: 'Nota enfermería',
    commandText: 'nota de enfermeria',
    roles: ['nurse'],
  },
  {
    intent: 'record_medication_administration',
    labelEs: 'Registrar MAR',
    commandText: 'registrar mar',
    roles: ['nurse'],
  },
];

const CONTEXT_PRIORITY: Partial<
  Record<string, readonly { intent: string; commandText: string; labelEs: string }[]>
> = {
  navMeds: [
    {
      intent: 'reconcile_medications',
      labelEs: 'Conciliar medicamentos',
      commandText: 'conciliacion medicamentosa',
    },
    {
      intent: 'prepare_pharmacy_review',
      labelEs: 'Validación farmacia',
      commandText: 'validacion farmaceutica',
    },
  ],
  navOrders: [
    {
      intent: 'request_laboratory',
      labelEs: 'Solicitar laboratorio',
      commandText: 'solicitar laboratorio',
    },
    {
      intent: 'request_imaging',
      labelEs: 'Solicitar imagen',
      commandText: 'solicitar imagen',
    },
  ],
  navLabs: [
    {
      intent: 'open_results_inbox',
      labelEs: 'Revisar resultados',
      commandText: 'revisar resultados pendientes',
    },
  ],
  navEvolution: [
    {
      intent: 'create_evolution_draft',
      labelEs: 'Nueva evolución',
      commandText: 'evolucionar paciente',
    },
  ],
};

function dedupeSuggestions(items: ContextPanelSuggestion[], limit: number): ContextPanelSuggestion[] {
  const seen = new Set<string>();
  const out: ContextPanelSuggestion[] = [];
  for (const item of items) {
    if (seen.has(item.intent)) continue;
    seen.add(item.intent);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

export function buildContextPanelSuggestions(
  input: ContextPanelSuggestionsInput,
  limit = 4,
): ContextPanelSuggestion[] {
  const prioritized: ContextPanelSuggestion[] = [];

  if ((input.activeAlertCount ?? 0) > 0) {
    prioritized.push({
      intent: 'open_results_inbox',
      labelEs: 'Revisar alertas',
      commandText: 'revisar resultados pendientes',
    });
  }

  if ((input.pendingDraftCount ?? 0) > 0) {
    prioritized.push({
      intent: 'create_evolution_draft',
      labelEs: 'Continuar borrador',
      commandText: 'evolucionar paciente',
    });
  }

  if (input.traditionalSection) {
    for (const seed of CONTEXT_PRIORITY[input.traditionalSection] ?? []) {
      prioritized.push({ ...seed });
    }
  }

  const roleBase = BASE_SUGGESTIONS.filter((s) => s.roles.includes(input.role)).map(
    ({ intent, labelEs, commandText }) => ({ intent, labelEs, commandText }),
  );

  if (input.aiAvailable) {
    prioritized.unshift({
      intent: 'summarize_patient',
      labelEs: 'Resumir con IA',
      commandText: 'resumir paciente',
    });
  }

  return dedupeSuggestions([...prioritized, ...roleBase], limit);
}
