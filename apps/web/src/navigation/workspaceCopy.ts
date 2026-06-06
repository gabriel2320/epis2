import { copy } from '@epis2/design-system';

/** Resuelve claves `workspaces.*` del microcopy canónico. */
export function resolveWorkspaceCopyKey(key: string): string {
  const parts = key.split('.');
  let node: unknown = copy;
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof node === 'string' ? node : key;
}
