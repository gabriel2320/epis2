import { useEffect, type ReactNode } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { useClinicalNavigate, type CommandSearch } from '../routes/clinicalNavigate.js';
import { useAuth } from '../auth/AuthContext.js';
import { canOpenMode } from './episModeGuards.js';
import { resolveActiveMode } from './episModes.js';
import { EPIS_SELECT_PATIENT_FOR_CLASSIC } from './episModeSearch.js';

export type EpisModeGuardProps = {
  children: ReactNode;
  /** Si true, redirige classic sin paciente al comando. */
  enforceClassicPatient?: boolean;
  /** Si true, redirige dashboard sin permiso al comando. */
  enforceDashboardPermission?: boolean;
};

/** Guardas de modo — redirección segura sin router paralelo. */
export function EpisModeGuard({
  children,
  enforceClassicPatient = false,
  enforceDashboardPermission = false,
}: EpisModeGuardProps) {
  const navigate = useClinicalNavigate();
  const { session } = useAuth();
  const { patient } = useActivePatient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr ?? '' });
  const params = new URLSearchParams(searchStr);
  const searchRecord = {
    mode: params.get('mode') ?? undefined,
    view: params.get('view') ?? undefined,
  };
  const activeMode = resolveActiveMode(pathname, searchRecord);

  useEffect(() => {
    if (!session) {
      void navigate({ to: '/login' });
      return;
    }

    if (enforceClassicPatient && activeMode === 'classic' && !patient?.id) {
      void navigate({
        to: '/comando',
        search: EPIS_SELECT_PATIENT_FOR_CLASSIC satisfies CommandSearch,
      });
      return;
    }

    if (enforceDashboardPermission && activeMode === 'dashboard') {
      const ok = canOpenMode('dashboard', {
        role: session.user.role,
        permissions: session.permissions,
        activePatientId: patient?.id,
      });
      if (!ok) {
        void navigate({
          to: '/comando',
          search: { error: 'dashboardPermission' } satisfies CommandSearch,
        });
      }
    }
  }, [activeMode, enforceClassicPatient, enforceDashboardPermission, navigate, patient?.id, session]);

  return children;
}
