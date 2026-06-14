import { formatRelativeClinicalAgeEs } from '../clinicalContextDense.js';

export type SilentSuggestionVariant = 'info' | 'suggestion' | 'warning';

export type SilentClinicalSuggestion = {
  id: string;
  variant: SilentSuggestionVariant;
  labelEs: string;
  detailEs?: string | undefined;
  commandSample?: string | undefined;
  priority: number;
};

export type BuildSilentSuggestionsInput = {
  alerts?: readonly {
    ruleId: string;
    severity: 'warning' | 'critical';
    message: string;
    detail: string;
  }[];
  summaryFields?: Record<string, string> | undefined;
  observations?: readonly { label: string; valueText: string; observedAt: string }[];
  allergies?: readonly { substance: string }[];
  chronicFocus?: 'dm2' | 'hta' | null | undefined;
  now?: Date | undefined;
};

const DEMO_ONLY = /demo\s*\/?\s*sint[eé]tico|sin alertas reales|ficticio/i;

function fold(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function detectChronicFocus(summaryFields: Record<string, string>): 'dm2' | 'hta' | null {
  const blob = fold(
    [summaryFields.activeProblems, summaryFields.relevantLabs].filter(Boolean).join(' '),
  );
  if (/diabetes|dm2|dm\s*2|glicemia|hba1c/.test(blob)) return 'dm2';
  if (/hipertension|hta|presion arterial|presión arterial/.test(blob)) return 'hta';
  return null;
}

function parsePendingItems(text: string | undefined): string | null {
  const trimmed = text?.trim();
  if (!trimmed || DEMO_ONLY.test(trimmed)) return null;
  return trimmed;
}

function findLatestHba1c(
  observations: readonly { label: string; observedAt: string }[],
): { observedAt: string } | null {
  let latest: { observedAt: string; ts: number } | null = null;
  for (const obs of observations) {
    if (!/hba1c|hemoglobina\s+glicosilada/i.test(obs.label)) continue;
    const ts = new Date(obs.observedAt).getTime();
    if (Number.isNaN(ts)) continue;
    if (!latest || ts > latest.ts) latest = { observedAt: obs.observedAt, ts };
  }
  return latest ? { observedAt: latest.observedAt } : null;
}

function daysSince(iso: string, now: Date): number {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return 0;
  return Math.floor(Math.max(0, now.getTime() - then.getTime()) / 86_400_000);
}

const ALERT_COMMANDS: Record<string, string> = {
  'beta-lactam-cross-reactivity': 'conciliacion medicamentosa',
  'renal-dose-adjustment': 'ver resultados',
  'cdr.critical_lab_without_ack': 'ver resultados criticos',
  critical_lab_without_ack: 'ver resultados criticos',
  medication_reconciliation_gap: 'conciliacion medicamentosa',
  allergy_medication_conflict: 'revisar medicacion',
  duplicate_medication_order: 'conciliacion medicamentosa',
};

function alertCommandSample(ruleId: string): string | undefined {
  if (ALERT_COMMANDS[ruleId]) return ALERT_COMMANDS[ruleId];
  const base = ruleId.replace(/^cdr\./, '');
  return ALERT_COMMANDS[base];
}

/** MF-DI-06 — chips silenciosos determinísticos (sin IA). */
export function buildSilentClinicalSuggestions(
  input: BuildSilentSuggestionsInput,
): SilentClinicalSuggestion[] {
  const now = input.now ?? new Date();
  const suggestions: SilentClinicalSuggestion[] = [];
  const seen = new Set<string>();

  const push = (item: SilentClinicalSuggestion) => {
    if (seen.has(item.id)) return;
    seen.add(item.id);
    suggestions.push(item);
  };

  for (const alert of input.alerts ?? []) {
    push({
      id: `alert-${alert.ruleId}`,
      variant: alert.severity === 'critical' ? 'warning' : 'suggestion',
      labelEs: alert.message,
      detailEs: alert.detail,
      commandSample: alertCommandSample(alert.ruleId),
      priority: alert.severity === 'critical' ? 95 : 82,
    });
  }

  const chronicFocus =
    input.chronicFocus ?? (input.summaryFields ? detectChronicFocus(input.summaryFields) : null);

  for (const allergy of input.allergies ?? []) {
    const substance = allergy.substance.trim();
    if (!substance) continue;
    if (seen.has('allergy-documented')) continue;
    push({
      id: 'allergy-documented',
      variant: 'info',
      labelEs: `Alergia documentada: ${substance}`,
      detailEs: 'Verificar prescripción y órdenes activas.',
      priority: 55,
    });
  }

  const pending = parsePendingItems(input.summaryFields?.pendingItems);
  if (pending) {
    if (/laboratorio|lab|examen|panel|hemograma|creatinina|inr/i.test(pending)) {
      push({
        id: 'pending-lab',
        variant: 'suggestion',
        labelEs: 'Examen pendiente',
        detailEs: pending,
        commandSample:
          chronicFocus === 'dm2' ? 'solicitar panel control dm2' : 'solicitar laboratorio',
        priority: 62,
      });
    } else if (/receta|renovar|prescripcion|prescripción|vencer/i.test(pending)) {
      push({
        id: 'prescription-renewal',
        variant: 'suggestion',
        labelEs: 'Receta por renovar',
        detailEs: pending,
        commandSample: 'renovar receta cronica',
        priority: 68,
      });
    } else {
      push({
        id: 'pending-followup',
        variant: 'info',
        labelEs: 'Seguimiento pendiente',
        detailEs: pending,
        priority: 58,
      });
    }
  }

  const hba1c = findLatestHba1c(input.observations ?? []);
  if (chronicFocus === 'dm2') {
    const ageDays = hba1c ? daysSince(hba1c.observedAt, now) : 999;
    if (ageDays > 180) {
      const relative = hba1c
        ? formatRelativeClinicalAgeEs(hba1c.observedAt, now)
        : 'sin registro reciente';
      push({
        id: 'control-gap-hba1c',
        variant: 'suggestion',
        labelEs: 'Control HbA1c vencido',
        detailEs: hba1c ? `Último registro ${relative}.` : 'Sin HbA1c reciente en la ficha.',
        commandSample: 'solicitar panel control dm2',
        priority: 72,
      });
    }
  }

  const labsText = input.summaryFields?.relevantLabs ?? '';
  const paMatch = /pa\s+(\d{2,3})\s*\/\s*(\d{2,3})/i.exec(labsText);
  if (paMatch) {
    const systolic = Number.parseInt(paMatch[1]!, 10);
    if (Number.isFinite(systolic) && systolic >= 140) {
      push({
        id: 'elevated-bp',
        variant: 'warning',
        labelEs: 'Presión arterial elevada',
        detailEs: `Último registro ${paMatch[0]} en resumen clínico.`,
        commandSample: chronicFocus === 'hta' ? 'control hta' : 'control diabetes',
        priority: 75,
      });
    }
  }

  return suggestions.sort((a, b) => b.priority - a.priority);
}

export const SILENT_SUGGESTIONS_MAX_VISIBLE = 3;
