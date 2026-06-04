import type { Permission } from '@epis2/clinical-domain';

/** Intents clínicos MVP v1 (EPIS2-05). */
export type ClinicalIntent =
  | 'search_patient'
  | 'summarize_patient'
  | 'create_evolution_draft'
  | 'prepare_discharge_draft'
  | 'prepare_prescription'
  | 'request_laboratory';

export type CommandResolveStatus =
  | 'resolved'
  | 'needs_clarification'
  | 'needs_patient'
  | 'forbidden'
  | 'empty';

export type CommandSlots = {
  patientHint?: string;
  medicationHint?: string;
  studyHint?: string;
};

export type CommandDefinition = {
  intent: ClinicalIntent;
  labelEs: string;
  aliasesEs: readonly string[];
  routePath: string;
  requiredPermission: Permission;
  requiresPatient: boolean;
  priority: number;
  match: (normalized: string) => boolean;
};

export type CommandResolveInput = {
  text: string;
  role: string;
  patientId?: string;
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
      status: 'forbidden';
      message: string;
      permission: Permission;
    }
  | {
      status: 'empty';
      message: string;
    };
