import type { Permission } from '@epis2/clinical-domain';
import type {
  CommandActionType,
  CommandCategory,
  CommandFamily,
  CommandRequiredContext,
  CommandSafetyLevel,
} from './intent-metadata.js';

export type {
  CommandActionType,
  CommandCategory,
  CommandFamily,
  CommandRequiredContext,
  CommandSafetyLevel,
  SecureCommandMeta,
} from './intent-metadata.js';

/** Intents clínicos MVP v1 (EPIS2-05). */
export type ClinicalIntent =
  | 'search_patient'
  | 'open_patient_chart'
  | 'summarize_patient'
  | 'create_evolution_draft'
  | 'prepare_discharge_draft'
  | 'prepare_prescription'
  | 'request_laboratory'
  | 'request_referral'
  | 'request_imaging'
  | 'request_procedure'
  | 'create_nursing_note'
  | 'record_medication_administration'
  | 'prepare_pharmacy_review'
  | 'open_dashboard'
  | 'open_dashboard_work'
  | 'open_dashboard_patient'
  | 'open_dashboard_service'
  | 'open_dashboard_quality'
  | 'admit_patient_hospital'
  | 'open_results_inbox'
  | 'reconcile_medications'
  | 'transfer_patient'
  | 'create_outpatient_visit'
  | 'create_medical_certificate'
  | 'respond_referral'
  | 'register_allergy'
  | 'register_problem';

export type CommandResolveStatus =
  | 'resolved'
  | 'needs_clarification'
  | 'needs_patient'
  | 'needs_confirmation'
  | 'forbidden'
  | 'empty';

export type CommandSlots = {
  patientHint?: string;
  medicationHint?: string;
  studyHint?: string;
  specialtyHint?: string;
  bodySiteHint?: string;
  urgencyHint?: 'routine' | 'urgent' | 'stat';
  /** CE-4: motivo clínico explícito en la frase del comando. */
  clinicalReasonHint?: string;
  /** CE-4: fragmento de nota/evolución tras «nota:» o «evolución:». */
  noteHint?: string;
};

export type CommandDefinition = {
  intent: ClinicalIntent;
  labelEs: string;
  description: string;
  aliasesEs: readonly string[];
  examples: readonly string[];
  family: CommandFamily;
  category: CommandCategory;
  requiredContext: readonly CommandRequiredContext[];
  safetyLevel: CommandSafetyLevel;
  actionType: CommandActionType;
  confirmationRequired: boolean;
  routePath: string;
  formId?: string;
  requiredPermission: Permission;
  requiresPatient: boolean;
  priority: number;
  match: (normalized: string) => boolean;
};

export type CommandCandidate = {
  intent: ClinicalIntent;
  labelEs: string;
};

export type CommandWorkspace = 'command_center' | 'patient_chart' | 'clinical_form';

export type CommandActiveContext = {
  pendingDraftCount?: number;
  activeAlertCount?: number;
  workspace?: CommandWorkspace;
};

export type CommandAssistHint = {
  intent?: ClinicalIntent;
  confidence: number;
  missingContext: readonly CommandRequiredContext[];
  reason: string;
  suggestedCandidates: readonly ClinicalIntent[];
};

export type CommandResolveInput = {
  text: string;
  role: string;
  patientId?: string;
  context?: CommandActiveContext;
  /** CE-2: usuario confirmó abrir formulario order/sign. */
  confirmed?: boolean;
  /** CE-3: hint del micro-router local (validado por registry). */
  assistHint?: CommandAssistHint;
};

export type CommandResolveResult =
  | {
      status: 'resolved';
      intent: ClinicalIntent;
      labelEs: string;
      routePath: string;
      slots: CommandSlots;
    }
  | {
      status: 'needs_clarification';
      message: string;
      candidates: Array<{ intent: ClinicalIntent; labelEs: string }>;
    }
  | {
      status: 'needs_patient';
      message: string;
      intent: ClinicalIntent;
      labelEs: string;
    }
  | {
      status: 'needs_confirmation';
      message: string;
      intent: ClinicalIntent;
      labelEs: string;
      routePath: string;
      safetyLevel: CommandSafetyLevel;
      slots: CommandSlots;
    }
  | {
      status: 'forbidden';
      message: string;
      permission: Permission;
    }
  | {
      status: 'empty';
      message: string;
    };
