/** Frases EPIS P8 sin formulario MVP — no deben resolverse a un intent productivo. */
export function isEpisOutOfScopePhrase(normalized: string): boolean {
  if (/\bingreso\b/.test(normalized) && !/egreso|alta|epicrisis|discharge/.test(normalized)) {
    return true;
  }
  if (/\binterconsulta\b/.test(normalized) || /\bderivar\b/.test(normalized)) {
    return true;
  }
  if (/\bcontexto\b/.test(normalized) && /(clinico|paciente)/.test(normalized)) {
    return true;
  }
  if (/\b(signos\s+vitales|enfermeria)\b/.test(normalized)) {
    return true;
  }
  if (/\b(radiografia|rayos|placa|tac)\b/.test(normalized) && !/laboratorio|hemograma/.test(normalized)) {
    return true;
  }
  return false;
}
