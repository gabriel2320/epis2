/** Recorridos demo narrativos — solo dev o flag explícito (UX Vista 1). */
export function isDemoNarrativesEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_DEMO_NARRATIVES;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return import.meta.env.DEV;
}
