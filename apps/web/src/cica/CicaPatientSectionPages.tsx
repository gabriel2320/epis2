import { copy } from '@epis2/design-system';
import { findCicaScreenById, type ClinicalLayoutAction, type CicaScreenId } from '@epis2/epis2-ui';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { stubPatientBlueprint } from './blueprints/systemScreens.blueprint.js';

export type CicaPatientSectionPageProps = {
  screenId: CicaScreenId;
  placeholder?: string;
  actions?: readonly ClinicalLayoutAction[];
};

/** Sección ficha — blueprint generado (layout automatizado). */
export function CicaPatientSectionPage({
  screenId,
  placeholder = copy.forms.needsPatient,
  actions = [],
}: CicaPatientSectionPageProps) {
  if (!findCicaScreenById(screenId)) return null;

  return (
    <CicaPatientBlueprintPage
      blueprint={stubPatientBlueprint(screenId, placeholder)}
      actions={actions}
      slots={{}}
    />
  );
}
