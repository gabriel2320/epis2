import { findCicaScreenByRoutePrefix, type CicaScreenId } from '@epis2/epis2-ui';
import { useLocation } from '@tanstack/react-router';
import { CicaPatientDemoSectionPage } from './CicaPatientDemoSectionPage.js';
import { getCicaPatientDemoSectionConfig } from './cicaPatientDemoSections.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** Ficha CICA — sección demo resuelta desde registry + mapa config (MF-PONY-03). */
export function CicaPatientDemoSectionRoutePage() {
  const { pathname } = useLocation();
  const { patientId } = useCicaPatientPage();
  const screen = findCicaScreenByRoutePrefix(pathname);
  const config = screen
    ? getCicaPatientDemoSectionConfig(screen.id as CicaScreenId)
    : undefined;

  if (!patientId || !config) return null;

  return (
    <CicaPatientDemoSectionPage
      blueprint={config.blueprint}
      sectionId={config.demoSectionId}
      slotId={config.slotId}
      testId={config.testId}
      listTestId={config.listTestId}
    />
  );
}
