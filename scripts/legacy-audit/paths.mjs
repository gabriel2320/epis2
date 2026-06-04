import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EPIS2_ROOT = path.resolve(__dirname, '../..');

/** Rutas absolutas de repositorios (solo lectura sobre donantes). */
export const REPOS = {
  EPIS2: EPIS2_ROOT,
  EPIS: path.resolve(EPIS2_ROOT, '..', 'EPIS'),
  EPIDOS: path.resolve(EPIS2_ROOT, '..', 'Epidos'),
  EPIONE: path.resolve(EPIS2_ROOT, '..', 'clinical-ai-canvas-improved'),
};

export const SKIP_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'target',
  'coverage',
  '.turbo',
  '.cache',
  'test-results',
]);

export const FORBIDDEN_PATTERNS = [
  { id: 'openmrs-dep', re: /@openmrs\//i, severity: 'critical', label: 'Dependencia @openmrs' },
  { id: 'carbon-dep', re: /@carbon\b|carbon-components/i, severity: 'critical', label: 'Dependencia Carbon' },
  { id: 'openmrs-path', re: /openmrs[\\/]/i, severity: 'warning', label: 'Ruta openmrs/' },
  { id: 'home-epis-route', re: /\/home\/epis-/i, severity: 'warning', label: 'Ruta legacy /home/epis-*' },
  { id: 'wildcard-perm', re: /permission[s]?\s*[:=]\s*['"]\*['"]/i, severity: 'high', label: 'Permiso wildcard' },
  { id: 'auto-approve', re: /autoApprove|auto_approve|firma\s*autom/i, severity: 'high', label: 'Aprobación/firma automática' },
];

export const SECRET_PATTERNS = [
  { id: 'private-key', re: /BEGIN (RSA |EC )?PRIVATE KEY/, severity: 'critical' },
  { id: 'aws-key', re: /AKIA[0-9A-Z]{16}/, severity: 'critical' },
  { id: 'jwt-long', re: /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./, severity: 'high' },
  { id: 'password-assign', re: /(password|passwd|secret|api[_-]?key)\s*=\s*['"][^'"]{8,}['"]/i, severity: 'high' },
];

export const PHI_HINT_PATTERNS = [
  { id: 'rut-real-looking', re: /\b[12]\d{3}\.\d{3}\.\d{3}-[\dkK]\b/, severity: 'medium', label: 'RUT con formato real' },
];
