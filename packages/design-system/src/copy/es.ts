/** Microcopy clínico visible — español (EPIS2-02). */
export const copy = {
  appName: 'EPIS2',
  demoBadge: 'DEMO / SINTÉTICO',
  login: {
    title: 'Iniciar sesión',
    subtitle: 'Entorno de demostración — sin datos reales',
    submit: 'Entrar al Centro de Comando',
    roleLabel: 'Rol de demostración',
    hint: 'La autenticación real se implementa en EPIS2-03.',
  },
  commandCenter: {
    title: '¿Qué necesitas hacer?',
    subtitle: 'Escribe una instrucción clínica o elige una sugerencia',
    powerBarPlaceholder: 'Ej.: evoluciona al paciente, resume al paciente…',
    powerBarLabel: 'Instrucción clínica',
    submit: 'Continuar',
    emptyCommand: 'Escribe qué necesitas hacer para continuar.',
    previewTitle: 'Vista previa (borrador de flujo)',
    previewPending: 'El enrutado de comandos se activa en EPIS2-05.',
  },
  layout: {
    backToCommand: 'Volver al Centro de Comando',
  },
  errors: {
    genericTitle: 'Algo salió mal',
    genericMessage: 'No pudimos completar la acción. Intenta de nuevo.',
    notFoundTitle: 'Página no encontrada',
    notFoundMessage: 'La ruta solicitada no existe en EPIS2.',
    retry: 'Reintentar',
  },
  roles: {
    physician: 'Médico',
    nurse: 'Enfermería',
    pharmacist: 'Farmacia',
    admin: 'Administración',
    auditor: 'Auditoría',
  },
} as const;

export type DemoRole = keyof typeof copy.roles;
