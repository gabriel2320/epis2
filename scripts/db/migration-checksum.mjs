import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** SHA256 estable CRLF→LF (misma lógica que db:migrate). */
export function migrationChecksum(content) {
  return createHash('sha256').update(content.replace(/\r\n/g, '\n')).digest('hex');
}

/** @param {string} root @param {string} filename */
export async function migrationFileChecksum(root, filename) {
  const content = await readFile(join(root, 'database', 'migrations', filename), 'utf8');
  return migrationChecksum(content);
}
