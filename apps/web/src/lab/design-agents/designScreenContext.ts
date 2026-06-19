/** Contexto estático para auditoría de diseño — sin PHI ni llamadas clínicas. */
export type DesignScreenContext = {
  route: string;
  pathname: string;
  surface: string;
  mode?: 'classic' | 'modern' | 'command-center' | 'dashboard';
  md3Pattern?: string;
  scrollPolicy?: string;
  testIds?: readonly string[];
  htmlSnippet?: string;
  screenshotPath?: string;
};

export function includesAny(haystack: string, tokens: readonly string[]): boolean {
  return tokens.some((t) => haystack.includes(t));
}
