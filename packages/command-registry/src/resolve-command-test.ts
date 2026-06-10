import type { CommandResolveInput, CommandResolveResult } from './types.js';
import { resolveCommand } from './router.js';

/** Simula confirmación humana CE-2 en tests de flujo end-to-end. */
export function resolveCommandWithAutoConfirm(input: CommandResolveInput): CommandResolveResult {
  const result = resolveCommand(input);
  if (result.status === 'needs_confirmation' && input.confirmed !== true) {
    return resolveCommand({ ...input, confirmed: true });
  }
  return result;
}
