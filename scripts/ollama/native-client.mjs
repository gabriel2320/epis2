/** Cliente Ollama nativo compartido (dev-agent + stack + automatización). */

import { getOllamaEnv, isModelInstalled, probeOllamaNative } from './ollama-core.mjs';
import { resolveOllamaRoute } from './model-router.mjs';

export { getOllamaEnv, isModelInstalled, probeOllamaNative } from './ollama-core.mjs';
export { resolveOllamaRoute, resolveAllOllamaRoutes, pickModelForFunction } from './model-router.mjs';
export { getWorkstationProfile, computeWorkstationTier } from './workstation-profile.mjs';

/**
 * @param {{ baseUrl?: string, model?: string, function?: import('./model-router.mjs').OllamaFunction }} [opts]
 */
export async function ensureOllamaReady(opts = {}) {
  if (opts.function) {
    const route = await resolveOllamaRoute({ function: opts.function, baseUrl: opts.baseUrl });
    if (!route.ollamaUp) {
      return {
        ready: false,
        stage: 'ping',
        reason: 'Ollama no responde',
        hint: 'npm run ai:enable   # o npm run stack:dev',
      };
    }
    if (route.missing) {
      return {
        ready: false,
        stage: 'model',
        reason: `Ningún candidato instalado para "${opts.function}" (tier ${route.tier})`,
        hint: 'npm run ai:pull-coder-models   # o: npm run ollama:route',
      };
    }
    return {
      ready: true,
      models: route.installedModels,
      baseUrl: route.baseUrl,
      model: route.model,
      route,
    };
  }

  const { baseUrl, model } = { ...getOllamaEnv(), ...opts };
  const probe = await probeOllamaNative(baseUrl);
  if (!probe.ok) {
    return {
      ready: false,
      stage: 'ping',
      reason: probe.reason,
      hint: 'npm run ai:enable   # o npm run stack:dev',
    };
  }
  if (!isModelInstalled(probe.models, model)) {
    return {
      ready: false,
      stage: 'model',
      reason: `Modelo "${model}" no instalado (tags: ${probe.models.slice(0, 4).join(', ') || 'vacío'})`,
      hint: `npm run ai:pull-model   # o: ollama pull ${model}`,
    };
  }
  return { ready: true, models: probe.models, baseUrl, model };
}

/** @param {{ baseUrl?: string, model?: string }} [opts] */
export async function getOllamaStatus(opts = {}) {
  const env = { ...getOllamaEnv(), ...opts };
  const probe = await probeOllamaNative(env.baseUrl);
  if (!probe.ok) {
    return {
      up: false,
      modelReady: false,
      ...env,
      reason: probe.reason,
    };
  }
  return {
    up: true,
    modelReady: isModelInstalled(probe.models, env.model),
    models: probe.models,
    ...env,
  };
}
