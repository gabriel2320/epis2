import { isSurgicalHistoryDescription } from './surgicalHistory.js';

export type ClinicalContextDenseLabHighlight = {
  label: string;
  value: string;
  observedAt: string;
  relativeAgeEs: string;
};

export type ClinicalContextDensePayload = {
  activeProblems: string[];
  medicationSummary: string | null;
  lastEncounterAt: string | null;
  lastEncounterRelativeEs: string | null;
  labHighlights: ClinicalContextDenseLabHighlight[];
  episodeOpen: boolean;
  careSettingLabel: string | null;
};

type ProblemRow = { description: string; status: string };
type MedicationRow = { name: string; doseText?: string | null | undefined; status: string };
type ObservationRow = { label: string; valueText: string; observedAt: string };

const LAB_PRIORITY = [/hba1c/i, /hemoglobina\s+glicosilada/i, /creatinina/i, /hemograma/i];

/** Antigüedad clínica legible en español (determinística, sin IA). MF-DI-01 */
export function formatRelativeClinicalAgeEs(iso: string, now = new Date()): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return 'fecha desconocida';

  const diffMs = Math.max(0, now.getTime() - then.getTime());
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return 'hoy';
  if (diffDays === 1) return 'hace 1 día';
  if (diffDays < 14) return `hace ${diffDays} días`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffDays < 60) {
    return diffWeeks === 1 ? 'hace 1 semana' : `hace ${diffWeeks} semanas`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffDays < 365) {
    return diffMonths === 1 ? 'hace 1 mes' : `hace ${diffMonths} meses`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? 'hace 1 año' : `hace ${diffYears} años`;
}

function labPriorityScore(label: string): number {
  const idx = LAB_PRIORITY.findIndex((re) => re.test(label));
  return idx === -1 ? LAB_PRIORITY.length : idx;
}

export function selectContextDenseLabHighlights(
  observations: readonly ObservationRow[],
  max = 3,
  now = new Date(),
): ClinicalContextDenseLabHighlight[] {
  return [...observations]
    .sort((a, b) => {
      const pri = labPriorityScore(a.label) - labPriorityScore(b.label);
      if (pri !== 0) return pri;
      return new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime();
    })
    .slice(0, max)
    .map((o) => ({
      label: o.label.trim(),
      value: o.valueText.trim(),
      observedAt: o.observedAt,
      relativeAgeEs: formatRelativeClinicalAgeEs(o.observedAt, now),
    }));
}

function formatMedicationSummary(
  medications: readonly MedicationRow[],
  maxItems = 4,
): string | null {
  const active = medications.filter((m) => {
    const status = m.status.trim().toLowerCase();
    return (
      status === 'active' ||
      status === 'activo' ||
      (!status.includes('suspend') &&
        !status.includes('stop') &&
        !status.includes('inactive') &&
        !status.includes('prn'))
    );
  });
  if (active.length === 0) return null;

  const lines = active.slice(0, maxItems).map((m) => {
    const dose = m.doseText?.trim();
    return dose ? `${m.name} ${dose}` : m.name;
  });
  if (active.length > maxItems) {
    lines.push(`+${active.length - maxItems} más`);
  }
  return lines.join(' · ');
}

function resolveActiveProblems(problems: readonly ProblemRow[]): string[] {
  return problems
    .filter((p) => p.status === 'active' && !isSurgicalHistoryDescription(p.description))
    .map((p) => p.description.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function resolveLastEncounterAt(
  ultimoEncuentroAt: string | null | undefined,
  encounters: readonly { startedAt: string; endedAt?: string | null | undefined }[],
): string | null {
  if (ultimoEncuentroAt) return ultimoEncuentroAt;
  let latest: string | null = null;
  for (const enc of encounters) {
    const at = enc.endedAt ?? enc.startedAt;
    if (!latest || new Date(at).getTime() > new Date(latest).getTime()) {
      latest = at;
    }
  }
  return latest;
}

export function buildClinicalContextDense(input: {
  problems: readonly ProblemRow[];
  medications: readonly MedicationRow[];
  observations: readonly ObservationRow[];
  encounters?: readonly { startedAt: string; endedAt?: string | null | undefined }[];
  ultimoEncuentroAt?: string | null;
  openEncounterId?: string | null;
  careSettingLabel?: string | null;
  now?: Date;
}): ClinicalContextDensePayload {
  const now = input.now ?? new Date();
  const lastEncounterAt = resolveLastEncounterAt(input.ultimoEncuentroAt, input.encounters ?? []);

  return {
    activeProblems: resolveActiveProblems(input.problems),
    medicationSummary: formatMedicationSummary(input.medications),
    lastEncounterAt,
    lastEncounterRelativeEs: lastEncounterAt
      ? formatRelativeClinicalAgeEs(lastEncounterAt, now)
      : null,
    labHighlights: selectContextDenseLabHighlights(input.observations, 3, now),
    episodeOpen: Boolean(input.openEncounterId),
    careSettingLabel: input.careSettingLabel?.trim() || null,
  };
}
