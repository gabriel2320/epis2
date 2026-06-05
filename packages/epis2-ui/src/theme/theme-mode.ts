/** Preferencia de modo (incluye seguir al sistema operativo). */
export type Epis2ThemeModePreference = 'light' | 'dark' | 'system';

/** Modo resuelto que consume `createEpis2Theme`. */
export type Epis2ResolvedThemeMode = 'light' | 'dark';

export function prefersDarkColorScheme(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveEffectiveThemeMode(
  preference: Epis2ThemeModePreference,
  systemPrefersDark = prefersDarkColorScheme(),
): Epis2ResolvedThemeMode {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light';
  return preference;
}

/** Escucha cambios del SO cuando la preferencia es `system`. */
export function subscribeColorScheme(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => onChange();
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
