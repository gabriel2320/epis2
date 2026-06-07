import { createHash } from 'node:crypto';
import { normalizeCommandText } from './normalize.js';
import type { CommandResolveResult } from './types.js';

export type CommandTelemetryOutcome =
  | 'resolved'
  | 'needs_clarification'
  | 'needs_patient'
  | 'needs_confirmation'
  | 'forbidden'
  | 'empty';

export type CommandTelemetryEvent = {
  normalizedHash: string;
  tokenCount: number;
  role: string;
  hadPatient: boolean;
  outcome: CommandTelemetryOutcome;
  topIntent?: string;
  candidateIds: string[];
  latencyMs: number;
  /** CE-3: segunda pasada con hint del micro-router local. */
  assistRouteUsed?: boolean;
};

export function hashCommandText(text: string): string {
  const normalized = normalizeCommandText(text);
  return createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

export function buildCommandTelemetryEvent(input: {
  text: string;
  role: string;
  patientId?: string;
  result: CommandResolveResult;
  latencyMs: number;
  assistRouteUsed?: boolean;
}): CommandTelemetryEvent {
  const normalized = normalizeCommandText(input.text);
  const tokens = normalized.split(/\s+/).filter(Boolean);

  const outcome = input.result.status as CommandTelemetryOutcome;
  let topIntent: string | undefined;
  let candidateIds: string[] = [];

  if (input.result.status === 'resolved') {
    topIntent = input.result.intent;
  } else if (input.result.status === 'needs_patient') {
    topIntent = input.result.intent;
  } else if (input.result.status === 'needs_confirmation') {
    topIntent = input.result.intent;
  } else if (input.result.status === 'needs_clarification') {
    candidateIds = input.result.candidates.map((c) => c.intent);
    topIntent = candidateIds[0];
  }

  return {
    normalizedHash: hashCommandText(input.text),
    tokenCount: tokens.length,
    role: input.role,
    hadPatient: Boolean(input.patientId),
    outcome,
    candidateIds,
    latencyMs: input.latencyMs,
    ...(topIntent ? { topIntent } : {}),
    ...(input.assistRouteUsed ? { assistRouteUsed: true } : {}),
  };
}
