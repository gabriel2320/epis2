import { describe, expect, it } from 'vitest';
import {
  SYNTHETIC_AI_EVAL_CASES,
  allSyntheticEvalsPassed,
  runSyntheticAiEvals,
} from './syntheticEvals.js';

describe('synthetic AI evals (V5)', () => {
  it('define casos de evaluación sintética', () => {
    expect(SYNTHETIC_AI_EVAL_CASES.length).toBeGreaterThanOrEqual(5);
  });

  it('todos los evals sintéticos pasan sin Ollama', () => {
    const results = runSyntheticAiEvals();
    expect(results.length).toBe(SYNTHETIC_AI_EVAL_CASES.length);
    expect(allSyntheticEvalsPassed(results)).toBe(true);
  });
});
