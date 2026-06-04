import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = join(__dirname, '../../..');

/** Código productivo escaneado por validadores (no docs de memoria legacy). */
export const SCAN_ROOTS = ['apps', 'packages', 'services', 'database', 'tests'];

export const SCAN_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.sql',
  '.css',
  '.scss',
  '.html',
]);

export const SCAN_IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  'drizzle',
]);

/** Rutas donde se permite mencionar términos prohibidos (memoria EPIS). */
export const LEGACY_DOC_PREFIXES = [
  'docs/legacy/',
  'docs/LEGACY_DONOR_MAP.md',
  'reports/',
];

export function isLegacyDoc(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  return LEGACY_DOC_PREFIXES.some((p) => normalized.startsWith(p) || normalized.includes(p));
}
