#!/usr/bin/env node
/** Evals Ollama cierre de tramo — todos los blueprints assist (Semana 4). */
import { runLiveEvals } from './ai-evals-live.mjs';

delete process.env.EPIS2_AI_EVALS_TRAMO;
delete process.env.EPIS2_AI_EVALS_BLUEPRINTS;
process.env.EPIS2_AI_EVALS_LIVE = 'all';

await runLiveEvals();
