export type ObservationPoint = {
  label: string;
  valueText: string;
  observedAt: string;
};

export function parseNumericObservation(valueText: string): number | null {
  const match = valueText.match(/([\d]+(?:[.,]\d+)?)/);
  if (!match?.[1]) return null;
  const normalized = match[1].replace(',', '.');
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

export function buildObservationTrend(
  observations: ObservationPoint[],
  metricLabel: string,
): { xAxisLabels: string[]; values: number[] } {
  const points = observations
    .filter((o) => o.label.toLowerCase() === metricLabel.toLowerCase())
    .map((o) => {
      const value = parseNumericObservation(o.valueText);
      if (value === null) return null;
      return {
        at: new Date(o.observedAt),
        value,
      };
    })
    .filter((p): p is { at: Date; value: number } => p !== null)
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  return {
    xAxisLabels: points.map((p) =>
      p.at.toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    ),
    values: points.map((p) => p.value),
  };
}
