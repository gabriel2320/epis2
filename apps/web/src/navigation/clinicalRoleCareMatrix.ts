import type { ClinicalRole } from '@epis2/clinical-domain';
import type { EpisClinicalWorkspaceId } from '@epis2/epis2-ui';

/** Ámbito asistencial — separado de workspace MD3 y de rol. */
export type EpisCareSettingId =
  | 'ambulatory'
  | 'inpatient_ward'
  | 'intermediate_care'
  | 'icu'
  | 'or'
  | 'emergency';

/** Ventana de acción — agrupa rutas por intención clínica, no por menú infinito. */
export type EpisActionWindowId =
  | 'command_intent'
  | 'patient_lookup'
  | 'ambulatory_encounter'
  | 'inpatient_ward_care'
  | 'intermediate_care_monitoring'
  | 'icu_critical_care'
  | 'or_perioperative'
  | 'emergency_response'
  | 'pharmacy_clinical_review'
  | 'quality_audit'
  | 'admin_operations';

export type EpisActionWindowDef = {
  id: EpisActionWindowId;
  labelKey: string;
  careSetting: EpisCareSettingId | 'institutional';
  routes: readonly string[];
  allowedRoles: readonly ClinicalRole[];
};

export type EpisRoleCareProfile = {
  role: ClinicalRole;
  labelKey: string;
  defaultWorkspace: EpisClinicalWorkspaceId;
  workspaces: readonly EpisClinicalWorkspaceId[];
  careSettings: readonly EpisCareSettingId[];
  actionWindows: readonly EpisActionWindowId[];
};

/** Workspace MD3 → ámbito clínico dominante. */
export const WORKSPACE_CARE_SETTING: Record<
  EpisClinicalWorkspaceId,
  EpisCareSettingId | 'institutional'
> = {
  command: 'ambulatory',
  reception: 'ambulatory',
  ambulatory: 'ambulatory',
  inpatient_ward: 'inpatient_ward',
  intermediate_care: 'intermediate_care',
  emergency: 'emergency',
  icu: 'icu',
  or: 'or',
  pharmacy_clinical: 'ambulatory',
  quality_iaas: 'institutional',
  admin_system: 'institutional',
};

export const EPIS_ACTION_WINDOWS: Record<EpisActionWindowId, EpisActionWindowDef> = {
  command_intent: {
    id: 'command_intent',
    labelKey: 'actionWindows.commandIntent',
    careSetting: 'ambulatory',
    routes: ['/comando'],
    allowedRoles: [
      'physician',
      'nurse',
      'paramedic',
      'kinesiologist',
      'pharmacist',
      'admin',
      'auditor',
    ],
  },
  patient_lookup: {
    id: 'patient_lookup',
    labelKey: 'actionWindows.patientLookup',
    careSetting: 'ambulatory',
    routes: ['/espacio/buscar-paciente', '/espacio/ficha', '/espacio/resumen'],
    allowedRoles: [
      'physician',
      'nurse',
      'paramedic',
      'kinesiologist',
      'pharmacist',
      'admin',
      'auditor',
    ],
  },
  ambulatory_encounter: {
    id: 'ambulatory_encounter',
    labelKey: 'actionWindows.ambulatoryEncounter',
    careSetting: 'ambulatory',
    routes: [
      '/espacio/ambulatorio',
      '/espacio/evolucion',
      '/espacio/certificado',
      '/epis2/dashboard?tab=aps',
    ],
    allowedRoles: ['physician', 'nurse', 'kinesiologist'],
  },
  inpatient_ward_care: {
    id: 'inpatient_ward_care',
    labelKey: 'actionWindows.inpatientWardCare',
    careSetting: 'inpatient_ward',
    routes: [
      '/espacio/ingreso',
      '/espacio/traslado',
      '/espacio/epicrisis',
      '/epis2/dashboard?tab=service',
    ],
    allowedRoles: ['physician', 'nurse', 'kinesiologist'],
  },
  intermediate_care_monitoring: {
    id: 'intermediate_care_monitoring',
    labelKey: 'actionWindows.intermediateCareMonitoring',
    careSetting: 'intermediate_care',
    routes: ['/espacio/enfermeria', '/epis2/dashboard?tab=nursing'],
    allowedRoles: ['physician', 'nurse', 'kinesiologist'],
  },
  icu_critical_care: {
    id: 'icu_critical_care',
    labelKey: 'actionWindows.icuCriticalCare',
    careSetting: 'icu',
    routes: ['/espacio/evolucion', '/espacio/enfermeria', '/epis2/dashboard?tab=icu'],
    allowedRoles: ['physician', 'nurse'],
  },
  or_perioperative: {
    id: 'or_perioperative',
    labelKey: 'actionWindows.orPerioperative',
    careSetting: 'or',
    routes: ['/epis2/dashboard?tab=or'],
    allowedRoles: ['physician', 'nurse'],
  },
  emergency_response: {
    id: 'emergency_response',
    labelKey: 'actionWindows.emergencyResponse',
    careSetting: 'emergency',
    routes: ['/epis2/dashboard?tab=emergency', '/espacio/ingreso'],
    allowedRoles: ['physician', 'nurse', 'paramedic'],
  },
  pharmacy_clinical_review: {
    id: 'pharmacy_clinical_review',
    labelKey: 'actionWindows.pharmacyClinicalReview',
    careSetting: 'ambulatory',
    routes: [
      '/espacio/farmacia',
      '/espacio/conciliacion',
      '/espacio/receta',
      '/epis2/dashboard?tab=pharmacy',
    ],
    allowedRoles: ['pharmacist', 'physician'],
  },
  quality_audit: {
    id: 'quality_audit',
    labelKey: 'actionWindows.qualityAudit',
    careSetting: 'institutional',
    routes: ['/epis2/dashboard?tab=quality', '/espacio/admin?tab=audit'],
    allowedRoles: ['auditor', 'admin', 'physician'],
  },
  admin_operations: {
    id: 'admin_operations',
    labelKey: 'actionWindows.adminOperations',
    careSetting: 'institutional',
    routes: ['/espacio/admin', '/epis2/dashboard?tab=reception'],
    allowedRoles: ['admin'],
  },
};

const WS = {
  command: 'command',
  reception: 'reception',
  ambulatory: 'ambulatory',
  inpatient: 'inpatient_ward',
  intermediate: 'intermediate_care',
  emergency: 'emergency',
  icu: 'icu',
  or: 'or',
  pharmacy: 'pharmacy_clinical',
  quality: 'quality_iaas',
  admin: 'admin_system',
} as const satisfies Record<string, EpisClinicalWorkspaceId>;

export const EPIS_ROLE_CARE_PROFILES: Record<ClinicalRole, EpisRoleCareProfile> = {
  physician: {
    role: 'physician',
    labelKey: 'roles.physician',
    defaultWorkspace: WS.ambulatory,
    workspaces: [
      WS.command,
      WS.ambulatory,
      WS.inpatient,
      WS.intermediate,
      WS.emergency,
      WS.icu,
      WS.or,
    ],
    careSettings: ['ambulatory', 'inpatient_ward', 'intermediate_care', 'emergency', 'icu', 'or'],
    actionWindows: [
      'command_intent',
      'patient_lookup',
      'ambulatory_encounter',
      'inpatient_ward_care',
      'intermediate_care_monitoring',
      'icu_critical_care',
      'or_perioperative',
      'emergency_response',
      'pharmacy_clinical_review',
      'quality_audit',
    ],
  },
  nurse: {
    role: 'nurse',
    labelKey: 'roles.nurse',
    defaultWorkspace: WS.inpatient,
    workspaces: [
      WS.command,
      WS.inpatient,
      WS.intermediate,
      WS.emergency,
      WS.icu,
      WS.or,
      WS.ambulatory,
    ],
    careSettings: ['inpatient_ward', 'intermediate_care', 'emergency', 'icu', 'or', 'ambulatory'],
    actionWindows: [
      'command_intent',
      'patient_lookup',
      'ambulatory_encounter',
      'inpatient_ward_care',
      'intermediate_care_monitoring',
      'icu_critical_care',
      'or_perioperative',
      'emergency_response',
    ],
  },
  paramedic: {
    role: 'paramedic',
    labelKey: 'roles.paramedic',
    defaultWorkspace: WS.emergency,
    workspaces: [WS.command, WS.emergency],
    careSettings: ['emergency'],
    actionWindows: ['command_intent', 'patient_lookup', 'emergency_response'],
  },
  kinesiologist: {
    role: 'kinesiologist',
    labelKey: 'roles.kinesiologist',
    defaultWorkspace: WS.ambulatory,
    workspaces: [WS.command, WS.ambulatory, WS.inpatient, WS.intermediate],
    careSettings: ['ambulatory', 'inpatient_ward', 'intermediate_care'],
    actionWindows: [
      'command_intent',
      'patient_lookup',
      'ambulatory_encounter',
      'inpatient_ward_care',
      'intermediate_care_monitoring',
    ],
  },
  pharmacist: {
    role: 'pharmacist',
    labelKey: 'roles.pharmacist',
    defaultWorkspace: WS.pharmacy,
    workspaces: [WS.command, WS.pharmacy],
    careSettings: ['ambulatory'],
    actionWindows: ['command_intent', 'patient_lookup', 'pharmacy_clinical_review'],
  },
  auditor: {
    role: 'auditor',
    labelKey: 'roles.auditor',
    defaultWorkspace: WS.quality,
    workspaces: [WS.command, WS.quality],
    careSettings: [],
    actionWindows: ['command_intent', 'patient_lookup', 'quality_audit'],
  },
  admin: {
    role: 'admin',
    labelKey: 'roles.admin',
    defaultWorkspace: WS.admin,
    workspaces: [WS.command, WS.reception, WS.admin, WS.quality],
    careSettings: [],
    actionWindows: ['command_intent', 'patient_lookup', 'admin_operations', 'quality_audit'],
  },
};

export function getRoleCareProfile(role: string): EpisRoleCareProfile {
  if (role in EPIS_ROLE_CARE_PROFILES) {
    return EPIS_ROLE_CARE_PROFILES[role as ClinicalRole];
  }
  return EPIS_ROLE_CARE_PROFILES.physician;
}

export function roleMayUseWorkspace(role: string, workspaceId: EpisClinicalWorkspaceId): boolean {
  if (workspaceId === 'command') return true;
  return getRoleCareProfile(role).workspaces.includes(workspaceId);
}

export function roleMayUseActionWindow(role: string, windowId: EpisActionWindowId): boolean {
  return getRoleCareProfile(role).actionWindows.includes(windowId);
}

export function workspacesForRole(role: string): readonly EpisClinicalWorkspaceId[] {
  return getRoleCareProfile(role).workspaces;
}

export function defaultWorkspaceForRole(role: string): EpisClinicalWorkspaceId {
  return getRoleCareProfile(role).defaultWorkspace;
}

export const CLINICAL_WORKSPACE_ORDER: readonly EpisClinicalWorkspaceId[] = [
  'command',
  'reception',
  'ambulatory',
  'inpatient_ward',
  'intermediate_care',
  'emergency',
  'icu',
  'or',
  'pharmacy_clinical',
  'quality_iaas',
  'admin_system',
];
