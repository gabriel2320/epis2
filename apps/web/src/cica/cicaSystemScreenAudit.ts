import { auditCicaScreen } from '@epis2/epis2-ui';

/** Auditoría CICA-L-01 — perfil system-workspace (sin banda paciente). */
const CICA_L01_SYSTEM_AUDIT_BASE = {
  systemWorkspace: true as const,
  patientIdentityVisible: false,
  hasReturnNavigation: true,
  documentStateVisible: true,
  hasUniqueIntent: true,
  visibleNavElements: 5,
  hasTransversalCommandBar: false,
  hasHorizontalOverflow: false,
  cardDepth: 1,
};

export function auditCicaPatientSearchScreen(): ReturnType<typeof auditCicaScreen> {
  return auditCicaScreen({
    ...CICA_L01_SYSTEM_AUDIT_BASE,
    primaryButtons: 1,
    primaryContentBlocks: 3,
    visibleActions: 2,
  });
}

export function auditCicaCensusScreen(): ReturnType<typeof auditCicaScreen> {
  return auditCicaScreen({
    ...CICA_L01_SYSTEM_AUDIT_BASE,
    primaryButtons: 0,
    primaryContentBlocks: 3,
    visibleActions: 1,
  });
}
