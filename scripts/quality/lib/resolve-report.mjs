/**
 * Resuelve rutas de reportes en raíz o en archive/2026-06 (PROG-PURGE-CICA).
 */
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const ARCHIVE_SUBDIR = 'reports/archive/2026-06';

/** @param {string} root repo root */
/** @param {string} relPath e.g. reports/epis2-mf-ff-01.md */
export function resolveReportPath(root, relPath) {
  const direct = join(root, relPath);
  if (existsSync(direct)) return direct;
  const archived = join(root, ARCHIVE_SUBDIR, basename(relPath));
  if (existsSync(archived)) return archived;
  return direct;
}

/** @param {string} root @param {string} relPath */
export function reportExists(root, relPath) {
  return existsSync(resolveReportPath(root, relPath));
}
