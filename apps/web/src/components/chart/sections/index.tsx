import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { isChartMirrorBatchSection } from '@epis2/clinical-forms';
import type { DemoChartDemoSectionId } from '../../../fixtures/devFixturesBridge.js';
import type { ReactNode } from 'react';
import type { TraditionalSectionId } from '../TraditionalSectionNav.js';
import { TraditionalSectionMirrorStrip } from './TraditionalSectionMirrorStrip.js';
import { TraditionalDemoSection } from './TraditionalDemoSection.js';
import { TraditionalAuditSection } from './TraditionalAuditSection.js';
import { TraditionalDocumentsSection } from './TraditionalDocumentsSection.js';
import { TraditionalAllergiesSection } from './TraditionalAllergiesSection.js';
import { TraditionalEvolutionSection } from './TraditionalEvolutionSection.js';
import { TraditionalLabsSection } from './TraditionalLabsSection.js';
import { TraditionalMedsSection } from './TraditionalMedsSection.js';
import { TraditionalOrdersSection } from './TraditionalOrdersSection.js';
import { TraditionalSectionDataTable } from './TraditionalSectionDataTable.js';

export type ResolveTraditionalSectionContentProps = {
  sectionId: TraditionalSectionId;
  demoCaseCode?: string | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  onRegisterAllergy?: (() => void) | undefined;
  onOpenEvolution?: (() => void) | undefined;
  onOpenDraft?: ((draftId: string) => void) | undefined;
  compositionMode?: 'default' | 'cica-classic' | undefined;
};

/** MF-TE-02 — contenido real/demo para secciones prioritarias. */
export function resolveTraditionalSectionContent({
  sectionId,
  demoCaseCode,
  longitudinal,
  onRegisterAllergy,
  onOpenEvolution,
  onOpenDraft,
  compositionMode = 'default',
}: ResolveTraditionalSectionContentProps): ReactNode | undefined {
  let content: ReactNode | undefined;
  switch (sectionId) {
    case 'navAllergies':
      content = (
        <TraditionalAllergiesSection
          demoCaseCode={demoCaseCode}
          longitudinal={longitudinal}
          onRegisterAllergy={onRegisterAllergy}
        />
      );
      break;
    case 'navMeds':
      content = (
        <TraditionalMedsSection
          demoCaseCode={demoCaseCode}
          longitudinal={longitudinal}
          compositionMode={compositionMode}
        />
      );
      break;
    case 'navOrders':
      content = (
        <TraditionalOrdersSection demoCaseCode={demoCaseCode} compositionMode={compositionMode} />
      );
      break;
    case 'navLabs':
      content = (
        <TraditionalLabsSection
          demoCaseCode={demoCaseCode}
          longitudinal={longitudinal}
          compositionMode={compositionMode}
        />
      );
      break;
    case 'navEvolution':
      content = (
        <TraditionalEvolutionSection
          longitudinal={longitudinal}
          onOpenEvolution={onOpenEvolution}
          onOpenDraft={onOpenDraft}
          compositionMode={compositionMode}
        />
      );
      break;
    case 'navDocuments':
      content = (
        <TraditionalDocumentsSection demoCaseCode={demoCaseCode} compositionMode={compositionMode} />
      );
      break;
    case 'navAudit':
      content = (
        <TraditionalAuditSection demoCaseCode={demoCaseCode} compositionMode={compositionMode} />
      );
      break;
    case 'navAnamnesis':
    case 'navPhysicalExam':
    case 'navDiagnoses':
    case 'navImaging':
    case 'navConsults':
    case 'navAdmin':
    case 'navEpicrisis':
    case 'navProcedures':
      content = (
        <TraditionalDemoSection
          demoCaseCode={demoCaseCode}
          sectionId={sectionId as DemoChartDemoSectionId}
        />
      );
      break;
    default:
      content = undefined;
  }

  if (!content) return undefined;
  if (compositionMode === 'cica-classic' || !isChartMirrorBatchSection(sectionId)) return content;

  return (
    <>
      {content}
      <TraditionalSectionMirrorStrip sectionId={sectionId} />
    </>
  );
}

export {
  TraditionalAllergiesSection,
  TraditionalAuditSection,
  TraditionalDemoSection,
  TraditionalEvolutionSection,
  TraditionalLabsSection,
  TraditionalMedsSection,
  TraditionalOrdersSection,
  TraditionalSectionDataTable,
};
