import { copy } from '@epis2/design-system';
import {
  CicaPatientScreenFrame,
  EpisM3Text,
  findCicaScreenById,
  type ClinicalLayoutAction,
  type CicaScreenId,
} from '@epis2/epis2-ui';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';
import { ErrorState } from '../components/ErrorState.js';

export type CicaPatientSectionPageProps = {
  screenId: CicaScreenId;
  placeholder?: string;
  actions?: readonly ClinicalLayoutAction[];
};

/** Sección ficha declarativa — screenId en registry + contenido opcional. */
export function CicaPatientSectionPage({
  screenId,
  placeholder = copy.forms.needsPatient,
  actions = [],
}: CicaPatientSectionPageProps) {
  const page = useCicaPatientPage();
  const { patientId, detailQuery, presentation, goPath } = page;
  const screen = findCicaScreenById(screenId);

  if (!patientId || !presentation || !screen) return null;

  if (detailQuery.isError) {
    return (
      <ErrorState
        title={copy.errors.genericTitle}
        message={copy.errors.genericMessage}
        onRetry={() => detailQuery.refetch()}
      />
    );
  }

  if (!detailQuery.data) return null;

  return (
    <CicaPatientScreenFrame
      screenId={screenId}
      patientId={patientId}
      activeTabId={page.activeTabId}
      onNavigate={goPath}
      identity={presentation.identity}
      contextItems={presentation.contextItems}
      actions={actions}
      hideActionBar={actions.length === 0}
      testId={`cica-screen-${screenId}`}
    >
      <EpisM3Text role="bodyMedium" color="text.secondary">
        {placeholder}
      </EpisM3Text>
    </CicaPatientScreenFrame>
  );
}
