export type LabPanelId =
  | 'hemograma'
  | 'perfil_bioquimico'
  | 'funcion_renal'
  | 'funcion_hepatica'
  | 'coagulacion'
  | 'gasometria'
  | 'inflamacion'
  | 'orina'
  | 'otros';

export type LabDictionaryEntry = {
  id: string;
  label: string;
  synonyms: readonly string[];
  unit: string;
  referenceLow?: number;
  referenceHigh?: number;
  criticalLow?: number;
  criticalHigh?: number;
  panel: LabPanelId;
  /** LOINC opcional — interoperabilidad futura */
  loinc?: string;
};

export type LabCriticalFlag = 'critical_low' | 'critical_high' | 'none';

export type LabValueAssessment = {
  entry: LabDictionaryEntry;
  value: number;
  flag: LabCriticalFlag;
  message?: string;
};

export type LabSearchResult = {
  entry: LabDictionaryEntry;
  score: number;
  matchedOn: 'label' | 'synonym' | 'id';
};
