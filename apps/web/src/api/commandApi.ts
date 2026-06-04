import type { CommandResolveRequest, CommandResolveResponse } from '@epis2/contracts';
import { apiFetch } from './client.js';

export function resolveCommand(
  request: CommandResolveRequest,
): Promise<CommandResolveResponse> {
  return apiFetch<CommandResolveResponse>('/api/commands/resolve', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
