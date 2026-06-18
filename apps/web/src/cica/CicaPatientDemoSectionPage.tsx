import type { DemoChartDemoSectionId } from '../fixtures/devFixturesBridge.js';
import { TraditionalDemoSection } from '../components/chart/sections/TraditionalDemoSection.js';
import type { ClinicalLayoutAction, CicaScreenBlueprint } from '@epis2/epis2-ui';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

export type CicaPatientDemoSectionPageProps = {
  blueprint: CicaScreenBlueprint;
  sectionId: DemoChartDemoSectionId;
  slotId: string;
  actions?: readonly ClinicalLayoutAction[];
  testId: string;
  listTestId?: string;
};

/** Ficha CICA — sección demo tradicional (blueprint + cap 5 filas). */
export function CicaPatientDemoSectionPage({
  blueprint,
  sectionId,
  slotId,
  actions = [],
  testId,
  listTestId,
}: CicaPatientDemoSectionPageProps) {
  const page = useCicaPatientPage();
  const { demoCase } = page;

  return (
    <CicaPatientBlueprintPage
      blueprint={blueprint}
      actions={actions}
      testId={testId}
      slots={{
        [slotId]: (
          <TraditionalDemoSection
            demoCaseCode={demoCase?.demoCaseCode}
            sectionId={sectionId}
            compositionMode="cica-classic"
            testId={listTestId ?? `cica-${sectionId}-list`}
          />
        ),
      }}
    />
  );
}
