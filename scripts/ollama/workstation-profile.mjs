/** Perfil de estación de trabajo para enrutar modelos Ollama. */
import { execSync } from 'node:child_process';
import os from 'node:os';

const VALID_TIERS = ['minimal', 'standard', 'performance'];

/** @param {number} ramGb @param {number} vramGb */
export function computeWorkstationTier(ramGb, vramGb) {
  const forced = process.env.EPIS2_WORKSTATION_TIER?.trim().toLowerCase();
  if (forced && VALID_TIERS.includes(forced)) return forced;

  if (ramGb >= 48 && (vramGb >= 12 || vramGb === 0)) return 'performance';
  if (ramGb >= 16 && (vramGb >= 8 || ramGb >= 32)) return 'standard';
  return 'minimal';
}

function detectVramGb() {
  const override = process.env.EPIS2_WORKSTATION_VRAM_GB?.trim();
  if (override) {
    const n = Number(override);
    if (Number.isFinite(n) && n >= 0) return Math.round(n);
  }
  try {
    const out = execSync('nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits', {
      encoding: 'utf8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const mb = Number(out.trim().split(/\r?\n/)[0]);
    if (Number.isFinite(mb) && mb > 0) return Math.round(mb / 1024);
  } catch {
    // sin GPU NVIDIA o nvidia-smi ausente
  }
  return 0;
}

/** @returns {{ ramGb: number, vramGb: number, cpuCores: number, tier: string, platform: string }} */
export function getWorkstationProfile() {
  const ramGb = Math.round(os.totalmem() / 1024 ** 3);
  const vramGb = detectVramGb();
  const cpuCores = os.cpus()?.length ?? 0;
  const tier = computeWorkstationTier(ramGb, vramGb);
  return {
    ramGb,
    vramGb,
    cpuCores,
    tier,
    platform: process.platform,
  };
}

export { VALID_TIERS };
