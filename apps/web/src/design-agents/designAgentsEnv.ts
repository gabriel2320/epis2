/** Configuración agentes de diseño — off por defecto; no bloquean UI productiva. */

export type DesignAgentsConfig = {
  enabled: boolean;
  model: string;
  baseUrl: string;
};

const DEFAULT_MODEL = 'qwen3:8b';
const DEFAULT_BASE_URL = 'http://localhost:11434';

function readEnv(key: string): string | undefined {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const env = import.meta.env as Record<string, string | undefined>;
    const viteVal = env[`VITE_${key}`];
    if (typeof viteVal === 'string' && viteVal.length > 0) return viteVal;
    const direct = env[key];
    if (typeof direct === 'string' && direct.length > 0) return direct;
  }
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }
  return undefined;
}

export function getDesignAgentsConfig(): DesignAgentsConfig {
  const enabledRaw = readEnv('EPIS2_DESIGN_AGENTS_ENABLED');
  return {
    enabled: enabledRaw === 'true' || enabledRaw === '1',
    model: readEnv('EPIS2_DESIGN_AGENT_MODEL') ?? DEFAULT_MODEL,
    baseUrl: readEnv('EPIS2_DESIGN_AGENT_BASE_URL') ?? DEFAULT_BASE_URL,
  };
}

export function areDesignAgentsEnabled(): boolean {
  return getDesignAgentsConfig().enabled;
}
