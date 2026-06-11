import { hasDemoTraditionalSectionContent } from '@epis2/test-fixtures';
import { TRADITIONAL_SECTION_IDS, type TraditionalSectionId } from './TraditionalSectionNav.js';

/** IDs nav visibles — oculta secciones demo vacías (MF-NORM-10). */
export function resolveVisibleTraditionalSections(
  demoCaseCode: string | undefined,
): readonly TraditionalSectionId[] {
  return TRADITIONAL_SECTION_IDS.filter((id) =>
    hasDemoTraditionalSectionContent(demoCaseCode, id),
  );
}
