/** Fase A — audit-only no aplica autocorrecciones. */
export async function applySafeHeal(_mode, _context) {
  return { applied: [], skipped: true, reason: 'audit-only — self-heal disabled' };
}
