export const queryKeys = {
  ai: {
    status: () => ['ai', 'status'] as const,
  },
  patients: {
    all: () => ['patients'] as const,
    list: (search?: string) => ['patients', 'list', search ?? ''] as const,
    detail: (patientId: string) => ['patients', 'detail', patientId] as const,
    longitudinal: (patientId: string) => ['patients', 'longitudinal', patientId] as const,
    clinicalAlerts: (patientId: string, blueprintId?: string, fieldsKey?: string) =>
      ['patients', 'clinical-alerts', patientId, blueprintId ?? '', fieldsKey ?? ''] as const,
  },
  drafts: {
    all: () => ['drafts'] as const,
    list: (params?: { patientId?: string; status?: string }) =>
      ['drafts', 'list', params?.patientId ?? '', params?.status ?? ''] as const,
    detail: (draftId: string) => ['drafts', 'detail', draftId] as const,
  },
  dashboard: {
    all: () => ['dashboard'] as const,
    work: () => ['dashboard', 'work'] as const,
    service: () => ['dashboard', 'service'] as const,
    nursing: () => ['dashboard', 'nursing'] as const,
    pharmacy: () => ['dashboard', 'pharmacy'] as const,
    quality: () => ['dashboard', 'quality'] as const,
    reception: () => ['dashboard', 'reception'] as const,
    emergency: () => ['dashboard', 'emergency'] as const,
    icu: () => ['dashboard', 'icu'] as const,
    or: () => ['dashboard', 'or'] as const,
    aps: () => ['dashboard', 'aps'] as const,
    specialty: () => ['dashboard', 'specialty'] as const,
    patient: (patientId: string) => ['dashboard', 'patient', patientId] as const,
  },
} as const;
