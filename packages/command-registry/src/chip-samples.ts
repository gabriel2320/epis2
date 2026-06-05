/** Frase de comando preferida para chips — completa y reconocible por el resolver. */
export function pickChipSampleEs(aliasesEs: readonly string[], labelEs: string): string {
  const preparar = aliasesEs.find((a) => /^preparar\b/i.test(a));
  if (preparar) return preparar;
  const solicitar = aliasesEs.find((a) => /^solicitar\b/i.test(a));
  if (solicitar) return solicitar;
  const registrar = aliasesEs.find((a) => /^registrar\b/i.test(a));
  if (registrar) return registrar;
  const multiWord = aliasesEs.find((a) => a.trim().split(/\s+/).length >= 2 && a.length >= 12);
  if (multiWord) return multiWord;
  return aliasesEs[0] ?? labelEs;
}
