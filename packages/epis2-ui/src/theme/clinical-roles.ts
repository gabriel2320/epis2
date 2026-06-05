/** Roles clínicos protegidos — no modificables por acento de usuario (M3-01). */
export const clinicalRoles = {
  draft: {
    main: '#5B5BD6',
    onMain: '#FFFFFF',
    container: '#EEEEFF',
    onContainer: '#1A1A5C',
  },
  aiAssistance: {
    main: '#7455A6',
    onMain: '#FFFFFF',
    container: '#F3EDFF',
    onContainer: '#3D2A5C',
  },
  approved: {
    main: '#18794E',
    onMain: '#FFFFFF',
    container: '#E8F5EE',
    onContainer: '#0D3D28',
  },
  warning: {
    main: '#9A6700',
    onMain: '#FFFFFF',
    container: '#FFF4CE',
    onContainer: '#5C3D00',
  },
  critical: {
    main: '#B42318',
    onMain: '#FFFFFF',
    container: '#FDECEC',
    onContainer: '#5C1210',
  },
} as const;

export type ClinicalRoleKey = keyof typeof clinicalRoles;
