const PRIORITY_LABELS: Record<string, string> = {
  rutina: 'Rutina',
  urgente: 'URGENTE',
};

/** Prioridad explícita en texto — nunca solo color (norma §16.2). */
export function printPriorityLabel(value: string | undefined): string {
  if (!value) return '—';
  const key = value.split('|')[0] ?? value;
  return PRIORITY_LABELS[key] ?? value;
}
