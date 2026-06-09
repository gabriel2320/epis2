import type { EpisMode } from '../modes/episModes.js';

export type EpisDbStatus = 'ok' | 'degraded';
export type EpisAiStatus = 'ok' | 'degraded' | 'off';
export type EpisSyncStatus = 'ok' | 'degraded' | 'offline';
export type EpisDraftStatus = 'none' | 'draft' | 'saved' | 'review' | 'readOnly';

export type EpisSystemStatus = {
  dbStatus: EpisDbStatus;
  aiStatus: EpisAiStatus;
  syncStatus: EpisSyncStatus;
  draftStatus: EpisDraftStatus;
  lastSavedAt?: string;
  lastAuditEvent?: string;
  activeMode: EpisMode;
  environment: string;
};

export function createDefaultSystemStatus(activeMode: EpisMode): EpisSystemStatus {
  return {
    dbStatus: 'ok',
    aiStatus: 'off',
    syncStatus: 'ok',
    draftStatus: 'none',
    activeMode,
    environment: 'demo',
  };
}
