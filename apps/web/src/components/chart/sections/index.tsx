import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { isChartMirrorBatchSection } from '@epis2/clinical-forms';
import type { DemoChartDemoSectionId } from '../../../fixtures/devFixturesBridge.js';
import type { ReactNode } from 'react';
import type { TraditionalSectionId } from '../TraditionalSectionNav.js';
import { TraditionalSectionMirrorStrip } from './TraditionalSectionMirrorStrip.js';
import { TraditionalDemoSection } from './TraditionalDemoSection.js';
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
};

/** MF-TE-02 — contenido real/demo para secciones prioritarias. */
export function resolveTraditionalSectionContent({
  sectionId,
  demoCaseCode,
  longitudinal,
  onRegisterAllergy,
  onOpenEvolution,
  onOpenDraft,
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
      content = <TraditionalMedsSection demoCaseCode={demoCaseCode} longitudinal={longitudinal} />;
      break;
    case 'navOrders':
      content = <TraditionalOrdersSection demoCaseCode={demoCaseCode} />;
      break;
    case 'navLabs':
      content = <TraditionalLabsSection demoCaseCode={demoCaseCode} longitudinal={longitudinal} />;
      break;
    case 'navEvolution':
      content = (
        <TraditionalEvolutionSection
          longitudinal={longitudinal}
          onOpenEvolution={onOpenEvolution}
          onOpenDraft={onOpenDraft}
        />
      );
      break;
    case 'navAnamnesis':
    case 'navPhysicalExam':
    case 'navDiagnoses':
    case 'navImaging':
    case 'navConsults':
    case 'navAdmin':
    case 'navDocuments':
    case 'navEpicrisis':
    case 'navProcedures':
    case 'navAudit':
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
  if (!isChartMirrorBatchSection(sectionId)) return content;

  return (
    <>
      {content}
      <TraditionalSectionMirrorStrip sectionId={sectionId} />
    </>
  );
}

export {
  TraditionalAllergiesSection,
  TraditionalDemoSection,
  TraditionalEvolutionSection,
  TraditionalLabsSection,
  TraditionalMedsSection,
  TraditionalOrdersSection,
  TraditionalSectionDataTable,
};
