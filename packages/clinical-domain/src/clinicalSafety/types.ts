/** CDS demo read-only — no bloquea aprobación ni escritura clínica. */

export interface SafetyMedication {
  name: string;
  status?: 'active' | 'held' | 'discontinued' | string;
}

export interface SafetyAllergy {
  substance: string;
  severity?: string;
}

export interface SafetyLab {
  name: string;
  value: string;
  unit?: string;
  flag?: string;
}

export interface ClinicalSafetyInput {
  allergies: SafetyAllergy[];
  medications: SafetyMedication[];
  labs?: SafetyLab[];
  patient?: {
    sex?: string;
    activeProblems?: string[];
  };
}

export interface SafetyWarning {
  ruleId: string;
  severity: 'warning' | 'critical';
  message: string;
  detail: string;
}

export interface ClinicalSafetyResult {
  warnings: SafetyWarning[];
  evaluatedAt: string;
  readOnly: true;
}
