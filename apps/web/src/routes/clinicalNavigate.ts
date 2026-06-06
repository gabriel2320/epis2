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
  | '/espacio/farmacia'
  | '/espacio/conciliacion'
  | '/espacio/certificado'
  | '/espacio/certificado/imprimir'
  | '/espacio/ambulatorio'
  | '/espacio/alergia'
  | '/espacio/problema'
  | '/espacio/ingreso'
  | '/espacio/traslado'
  | '/espacio/informe-interconsulta';

export type ClinicalPatientSearch = { patientId?: string };

export type DashboardTab = 'work' | 'patient' | 'service' | 'nursing' | 'pharmacy' | 'quality';

export type DashboardSearch = { tab?: DashboardTab; patientId?: string };

export type ForbiddenSearch = { detail?: string };

export type AdminTab = 'users' | 'catalogs' | 'audit' | 'ops' | 'forms';

export type AdminSearch = { tab?: AdminTab };

export type ClinicalNavigateTarget =
  | ClinicalFormRoutePath
  | '/espacio/ficha'
  | '/espacio/resultados'
  | '/espacio/borrador/$draftId'
  | '/espacio/admin'
  | '/epis2/dashboard'
  | '/comando'
  | '/preferencias-apariencia'
  | '/login'
  | '/sin-acceso';

export type ClinicalNavigateOptions =
  | { to: '/espacio/borrador/$draftId'; params: { draftId: string }; search?: ClinicalPatientSearch }
  | { to: '/epis2/dashboard'; search?: DashboardSearch; params?: never }
  | { to: '/espacio/admin'; search?: AdminSearch; params?: never }
  | { to: '/sin-acceso'; search?: ForbiddenSearch; params?: never }
  | {
      to: Exclude<
        ClinicalNavigateTarget,
        '/espacio/borrador/$draftId' | '/epis2/dashboard' | '/espacio/admin' | '/sin-acceso'
      >;
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
