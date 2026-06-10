import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '../../..');
export const THEME_SOURCE_DIR = path.join(REPO_ROOT, 'packages/epis2-ui/src/theme/source');
export const THEME_GENERATED_DIR = path.join(REPO_ROOT, 'packages/epis2-ui/src/theme/generated');
export const CLINICAL_SEMANTIC_ROLES_FILE = path.join(
  REPO_ROOT,
  'packages/epis2-ui/src/theme/clinical/clinical-semantic-roles.ts',
);
export const THEME_SNAPSHOTS_DIR = path.join(REPO_ROOT, 'reports/theme-snapshots');
