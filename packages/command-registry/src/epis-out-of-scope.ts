/** Frases EPIS P8 sin formulario MVP — no deben resolverse a un intent productivo. */
export function isEpisOutOfScopePhrase(normalized: string): boolean {
  if (
    /\bingreso\b/.test(normalized) &&
    !/egreso|alta|epicrisis|discharge|hospitalario|hospitalizacion/.test(normalized)
  ) {
    return true;
  }
  if (/\bcontexto\b/.test(normalized) && /(clinico|paciente)/.test(normalized)) {
    return true;
  }
  return false;
}
