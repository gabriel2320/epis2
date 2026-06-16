/** CICA-SG — tipos de admisión de pantalla. Ver docs/design/EPIS2_CICA_SCREEN_GOVERNOR.md */

export type ScreenContainerDecision =
  | 'inline-section'
  | 'tab'
  | 'tab-composed'
  | 'drawer'
  | 'modal'
  | 'full-screen-route'
  | 'dedicated-mode'
  | 'reject-duplicate';

export type DocumentLifecycle = 'none' | 'draft' | 'approved' | 'signed' | 'audited';

export type DataComplexity = 'low' | 'medium' | 'high';

export type RiskLevel = 'low' | 'medium' | 'high';

export type EpisLayoutProfile =
  | 'census'
  | 'classic-chart'
  | 'clinical-form'
  | 'paper-mode'
  | 'results'
  | 'documents'
  | 'audit';

export type ScreenGovernorVerdict = 'APPROVE' | 'REJECT';

export type ScreenNeedPrimaryAction = {
  id: string;
  label: string;
  risk?: RiskLevel;
};

/** Propuesta de necesidad clínica — input de proposeEpisScreen(). */
export type ScreenNeedProposal = {
  id: string;
  clinicalIntent: string;
  title?: string;
  proposedRoute?: string;
  proposedBlueprintId?: string;
  parentScreenId?: string;
  hasDistinctClinicalIntent: boolean;
  primaryAction?: ScreenNeedPrimaryAction | null;
  documentLifecycle?: DocumentLifecycle;
  dataComplexity?: DataComplexity;
  riskLevel?: RiskLevel;
  temporalNavigation?: boolean;
  needsPrint?: boolean;
  needsLargeTextArea?: boolean;
  needsSpace?: boolean;
  needsAuditTrail?: boolean;
  addsCognitiveLoad?: boolean;
  classicMode?: boolean;
  existingTabId?: string | null;
  isStateTransition?: boolean;
  patientScoped?: boolean;
  mixesMultipleIntents?: boolean;
  hidesPatientIdentity?: boolean;
  hidesDocumentState?: boolean;
  multiplePrimaryActions?: boolean;
  lacksReturnRoute?: boolean;
  clinicalFreezeWithoutMicrophase?: boolean;
  requiresSchemaMigration?: boolean;
  requiresSecondRegistry?: boolean;
  contradictsProductInvariants?: boolean;
};

export type EpisScreenDefinition = {
  id: string;
  route: string;
  title: string;
  clinicalIntent: string;
  parent: string;
  patientScoped: boolean;
  container: ScreenContainerDecision;
  layoutProfile: EpisLayoutProfile;
  primaryAction: { id: string; label: string; risk: RiskLevel };
  secondaryActions: Array<{ id: string; label: string; placement: 'visible' | 'overflow' }>;
  requiredSignals: Array<
    'patient-identity' | 'demo-state' | 'draft-status' | 'ai-state' | 'back-to-chart' | 'audit-trail'
  >;
  gates: string[];
};

export type EpisScreenProposalResult = {
  verdict: ScreenGovernorVerdict;
  container: ScreenContainerDecision | 'reject';
  admissionScore: number;
  reuseScreenId: string | null;
  requiresHumanReview: true;
  rejectReasons: string[];
  screenDefinition?: EpisScreenDefinition;
};
