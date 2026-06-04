export type MedicalActionCandidateKind =
  | "clinical_action"
  | "medication"
  | "lab_test"
  | "imaging_test"
  | "procedure"
  | "endoscopy"
  | "interconsultation"
  | "diagnosis"
  | "document"
  | "visualization"
  | "tool"
  | "safety_action";

export type MedicalActionSource =
  | "epione"
  | "local_catalog"
  | "isp_mock"
  | "rxnorm"
  | "loinc"
  | "fonasa"
  | "cie10"
  | "ges"
  | "epivigila"
  | "openmrs_import"
  | "gnuhealth_inspiration"
  | "lyra"
  | "manual";

export type MedicalActionResolveContext = "census" | "patient" | "form" | "document";

export interface MedicalActionCandidate {
  id: string;
  kind: MedicalActionCandidateKind;
  label: string;
  description: string;
  aliases: readonly string[];
  triggerTerms: readonly string[];
  source: MedicalActionSource;
  actionId?: string;
  targetActionId?: string;
  toolId?: string;
  viewId?: string;
  code?: string;
  codingSystem?: string;
  specialty?: string;
  careContext: readonly string[];
  requiredRole?: readonly string[];
  requiredPermissions?: readonly string[];
  priority: number;
  commonalityScore: number;
  riskLevel?: "low" | "medium" | "high";
  prefillFormData?: Record<string, string>;
  metadata?: Record<string, string | boolean | number>;
}

export interface MedicalActionSuggestion {
  label: string;
  description: string;
  kind: MedicalActionCandidateKind | "action" | "visualization" | "tool";
  actionId?: string;
  viewId?: string;
  toolId?: string;
  prefillFormData?: Record<string, string>;
  confidence: "high" | "medium" | "low";
  chips: readonly string[];
  source: MedicalActionSource;
  requiresHumanReview: true;
  score: number;
  catalogId?: string;
}

export interface MedicalActionResolution {
  query: string;
  normalizedQuery: string;
  candidates: MedicalActionCandidate[];
  suggestions: MedicalActionSuggestion[];
  fallbackUsed: boolean;
  sourceStats: Record<string, number>;
  latencyMs: number;
}

export interface MedicalActionResolveInput {
  query: string;
  role: string;
  careContext?: string;
  contextSignals?: readonly string[];
  limit?: number;
  resolveContext?: MedicalActionResolveContext;
  canPerformAction?: (actionId: string) => boolean;
  isActionAvailable?: (actionId: string) => boolean;
  /** Catálogo explícito (p. ej. JSON en disco en backend). */
  catalog?: readonly MedicalActionCandidate[];
}

export interface MedicalActionCatalogStatus {
  medicationsCount: number;
  labTestsCount: number;
  imagingTestsCount: number;
  proceduresCount: number;
  endoscopyCount: number;
  interconsultationsCount: number;
  documentsCount: number;
  clinicalActionsCount: number;
  orderSetsCount: number;
  diagnosesCount: number;
  sources: readonly string[];
}
