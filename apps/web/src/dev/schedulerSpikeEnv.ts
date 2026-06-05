/** Spike Scheduler (MUI-10) solo desarrollo o con flag explícito. */
export function isSchedulerSpikeEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_SCHEDULER_SPIKE;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return import.meta.env.DEV;
}
