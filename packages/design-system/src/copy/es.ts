/** Microcopy clínico visible — español (EPIS2-02). */
export const copy = {
  appName: 'EPIS2',
  demoBadge: 'DEMO / SINTÉTICO',
  login: {
    title: 'Iniciar sesión',
    subtitle: 'Entorno de demostración — sin datos reales',
    submit: 'Entrar al Centro de Comando',
    submitting: 'Entrando…',
    usernameLabel: 'Usuario demo',
    demoKeyLabel: 'Clave demo sintética',
    demoKeyPlaceholder: 'Ej.: DEMO-CLAVE-MEDICO',
    hint: 'Claves demo públicas de laboratorio. No usar credenciales reales.',
  },
  commandCenter: {
    title: '¿Qué necesitas hacer?',
    subtitle: 'Escribe una instrucción clínica o elige una sugerencia',
    powerBarPlaceholder: 'Ej.: evoluciona al paciente, resume al paciente…',
    powerBarLabel: 'Instrucción clínica',
    submit: 'Continuar',
    emptyCommand: 'Escribe qué necesitas hacer para continuar.',
    previewTitle: 'Resultado del comando',
    resolving: 'Interpretando instrucción…',
    resolvedNavigate: 'Abriendo espacio clínico…',
    needsPatient: 'Selecciona o busca un paciente antes de continuar.',
    needsClarification: 'El comando es ambiguo. Prueba una frase más específica.',
    forbidden: 'Tu rol no puede ejecutar este comando.',
    unknownCommand: 'No reconocimos el comando.',
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
