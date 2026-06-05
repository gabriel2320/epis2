import { useNavigate } from '@tanstack/react-router';

/** Rutas de formularios clínicos (shell `/espacio/*`). */
export type ClinicalFormRoutePath =
  | '/espacio/buscar-paciente'
  | '/espacio/resumen'
  | '/espacio/evolucion'
  | '/espacio/epicrisis'
  | '/espacio/receta'
  | '/espacio/laboratorio'
  | '/espacio/interconsulta'
  | '/espacio/imagenologia'
  | '/espacio/enfermeria'
  | '/espacio/mar'
  | '/espacio/farmacia';

export type ClinicalPatientSearch = { patientId?: string };

export type DashboardTab = 'work' | 'patient' | 'service' | 'quality';

export type DashboardSearch = { tab?: DashboardTab; patientId?: string };

export type ClinicalNavigateTarget =
  | ClinicalFormRoutePath
  | '/espacio/ficha'
  | '/espacio/borrador/$draftId'
  | '/epis2/dashboard'
  | '/comando'
  | '/login';

export type ClinicalNavigateOptions =
  | { to: '/espacio/borrador/$draftId'; params: { draftId: string }; search?: ClinicalPatientSearch }
  | { to: '/epis2/dashboard'; search?: DashboardSearch; params?: never }
  | {
      to: Exclude<ClinicalNavigateTarget, '/espacio/borrador/$draftId' | '/epis2/dashboard'>;
      search?: ClinicalPatientSearch;
      params?: never;
    };

/**
 * Navegación tipada al shell clínico. TanStack pierde literales cuando las rutas
 * se crean con `.map()` sobre blueprints; este wrapper centraliza el cast seguro.
 */
export function useClinicalNavigate() {
  const navigate = useNavigate();
  return (options: ClinicalNavigateOptions) => {
    void (navigate as (opts: ClinicalNavigateOptions) => void)(options);
  };
}
