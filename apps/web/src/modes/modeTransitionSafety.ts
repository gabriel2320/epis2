/** Registro ligero de trabajo no guardado — MF-THREE-MODES-03. */

export type UnsavedWorkProbe = () => boolean;

const probes = new Set<UnsavedWorkProbe>();

export function registerUnsavedWorkProbe(probe: UnsavedWorkProbe): () => void {
  probes.add(probe);
  return () => {
    probes.delete(probe);
  };
}

export function hasUnsavedClinicalWork(): boolean {
  for (const probe of probes) {
    if (probe()) return true;
  }
  return false;
}
