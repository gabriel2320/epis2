/** Espacio de trabajo clínico — Nivel 0 MD3 (conmutador del Navigation Rail). */
export type EpisClinicalWorkspaceId =
  | 'command'
  | 'reception'
  | 'ambulatory'
  | 'emergency'
  | 'icu'
  | 'quality_iaas'
  | 'admin_system';

/** Niveles MD3 dentro de un workspace (ver EPIS2_ROLE_WORKSPACES_M3.md). */
export type EpisClinicalShellLevel = 0 | 1 | 2 | 3 | 4;

export type EpisWorkspaceRailItemDef = {
  id: string;
  labelKey: string;
  route: string;
  disabled?: boolean;
};

export type EpisClinicalWorkspaceDefinition = {
  id: EpisClinicalWorkspaceId;
  labelKey: string;
  descriptionKey: string;
  /** Ítems del rail cuando este workspace está activo (sin incluir Comando). */
  railItems: readonly EpisWorkspaceRailItemDef[];
  /** Tabs N2 cuando hay paciente activo — claves en copy.patientChart.tabs o workspace-specific. */
  patientTabIds?: readonly string[];
  /** FAB N4 por defecto. */
  primaryFabKey?: string;
  /** Roles clínicos que pueden activar este workspace. */
  allowedRoles?: readonly string[];
};
