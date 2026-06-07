/**
 * Métricas evals Ollama en vivo — latencia p95 y tasa JSON/contrato válido.
 */

/**
 * @param {number[]} values
 * @param {number} p
 */
export function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, idx)];
}

/**
 * @param {Array<{ passed: boolean; latencyMs: number; contractValid?: boolean }>} results
 */
export function computeEvalMetrics(results) {
  const latencies = results.map((r) => r.latencyMs).filter((n) => n > 0);
  const passed = results.filter((r) => r.passed).length;
  const contractValid = results.filter((r) => r.contractValid !== false).length;
  const count = results.length;

  return {
    count,
    passRate: count ? Number((passed / count).toFixed(3)) : 0,
    validJsonRate: count ? Number((contractValid / count).toFixed(3)) : 0,
    avgLatencyMs: latencies.length
      ? Math.round(latencies.reduce((sum, n) => sum + n, 0) / latencies.length)
      : 0,
    p95LatencyMs: percentile(latencies, 95),
  };
}
