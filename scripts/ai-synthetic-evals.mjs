/**
 * Evals sintéticas IA (V5) — sin Ollama.
 */
async function main() {
  const { runSyntheticAiEvals, allSyntheticEvalsPassed } =
    await import('../services/local-ai/dist/syntheticEvals.js');
  const results = runSyntheticAiEvals();
  for (const r of results) {
    const mark = r.passed ? 'OK' : 'FAIL';
    console.log(`[${mark}] ${r.id}${r.detail ? ` — ${r.detail}` : ''}`);
  }
  if (!allSyntheticEvalsPassed(results)) {
    console.error('ai:evals FAILED');
    process.exit(1);
  }
  console.log(`ai:evals OK — ${results.length} caso(s)`);
}

main().catch((err) => {
  console.error('ai:evals FAILED:', err.message ?? err);
  process.exit(1);
});
