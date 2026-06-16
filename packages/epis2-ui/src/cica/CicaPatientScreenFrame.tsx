import type { ReactNode } from 'react';
import type { ClinicalLayoutAction } from '../layout/clinical/clinicalLayoutEngine.js';
import type { CicaChartTabId } from './CICA_CHART_TAB_REGISTRY.js';
import { CicaChartTabs } from './CicaChartTabs.js';
import { CicaScreenFrame } from './CicaScreenFrame.js';
import type { CicaContextStripProps } from './CicaContextStrip.js';
import { CicaContextStrip } from './CicaContextStrip.js';
import type { CicaPatientIdentityBandProps } from './CicaPatientIdentityBand.js';
import { CicaPatientIdentityBand } from './CicaPatientIdentityBand.js';
import type { CicaScreenId } from './cicaRoutes.js';

export type CicaPatientScreenFrameProps = {
  screenId: CicaScreenId;
  patientId: string;
  activeTabId: CicaChartTabId;
  onNavigate: (path: string) => void;
  identity: CicaPatientIdentityBandProps;
  contextItems?: CicaContextStripProps['items'];
  actions?: readonly ClinicalLayoutAction[];
  hideActionBar?: boolean;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  testId?: string;
};

/**
 * Frame ficha paciente — identidad + contexto + tabs + acciones.
 * Reutilizar en todas las secciones /app/pacientes/:id/*.
 */
export function CicaPatientScreenFrame({
  screenId,
  patientId,
  activeTabId,
  onNavigate,
  identity,
  contextItems = [],
  actions = [],
  hideActionBar = false,
  title,
  subtitle,
  children,
  testId,
}: CicaPatientScreenFrameProps) {
  return (
    <CicaScreenFrame
      screenId={screenId}
      {...(title ? { title } : {})}
      {...(subtitle ? { subtitle } : {})}
      identityBand={<CicaPatientIdentityBand {...identity} />}
      {...(contextItems.length > 0 ? { contextStrip: <CicaContextStrip items={contextItems} /> } : {})}
      tabs={
        <CicaChartTabs
          patientId={patientId}
          activeTabId={activeTabId}
          onNavigate={onNavigate}
        />
      }
      actions={actions}
      hideActionBar={hideActionBar}
      {...(testId ? { testId } : {})}
    >
      {children}
    </CicaScreenFrame>
  );
}
