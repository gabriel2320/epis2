import type { ClinicalIntent } from '@epis2/command-registry';

/** Abreviaturas y jerga hospitalaria chilena → intent clínico. */
export const CLINICAL_ABBREVIATIONS_ES_CL: Readonly<Record<string, ClinicalIntent>> = {
  lab: 'request_laboratory',
  labs: 'request_laboratory',
  rx: 'prepare_prescription',
  rec: 'prepare_prescription',
  tac: 'request_imaging',
  rxtx: 'request_imaging',
  eco: 'request_imaging',
  ic: 'request_referral',
  inter: 'request_referral',
  epic: 'prepare_discharge_draft',
  alta: 'prepare_discharge_draft',
  evol: 'create_evolution_draft',
  soap: 'create_evolution_draft',
  cert: 'create_medical_certificate',
  hemograma: 'request_laboratory',
  perfil: 'request_laboratory',
  k: 'open_results_inbox',
  na: 'open_results_inbox',
};
