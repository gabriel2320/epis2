#!/usr/bin/env node
/** Evals Ollama por tramo: node scripts/run-tramo-evals.mjs J */
import { runLiveEvals } from './ai-evals-live.mjs';

const tramo = (process.argv[2] ?? 'J').toUpperCase();
process.env.EPIS2_AI_EVALS_TRAMO = tramo;

await runLiveEvals();
