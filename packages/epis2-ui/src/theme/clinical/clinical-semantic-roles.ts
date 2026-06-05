/**
 * Roles clínicos protegidos — inmutables entre Clinical Blue y Calm Teal.
 * EPIS2 gobierna el significado clínico; Material Theme Builder gobierna acentos.
 */
export const clinicalSemanticRoles = {
  critical: {
    main: '#B42318',
    container: '#FDECEC',
    onContainer: '#7A271A',
  },
  warning: {
    main: '#9A6700',
    container: '#FFF4CE',
    onContainer: '#664D03',
  },
  approved: {
    main: '#18794E',
    container: '#E8F5EE',
    onContainer: '#0F5132',
  },
  draft: {
    main: '#5B5BD6',
    container: '#EEEEFF',
    onContainer: '#3535A0',
  },
  blocked: {
    main: '#B42318',
    container: '#FDECEC',
    onContainer: '#7A271A',
  },
  aiAssistance: {
    main: '#7455A6',
    container: '#F3EDFF',
    onContainer: '#412A66',
  },
  missingData: {
    main: '#9A6700',
    container: '#FFF8E1',
    onContainer: '#664D03',
  },
} as const;

export type ClinicalSemanticRoleKey = keyof typeof clinicalSemanticRoles;
