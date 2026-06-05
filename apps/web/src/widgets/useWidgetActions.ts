import { INTENT_ROUTE_PATHS, DASHBOARD_TAB_BY_INTENT } from '@epis2/command-registry';
import type { ClinicalIntent } from '@epis2/command-registry';
import type { WidgetAction } from '@epis2/epis2-widgets';
import { useCallback } from 'react';
import {
  useClinicalNavigate,
  type ClinicalFormRoutePath,
  type ClinicalNavigateTarget,
  type DashboardTab,
} from '../routes/clinicalNavigate.js';

export function useWidgetActions(patientId?: string) {
  const navigate = useClinicalNavigate();

  return useCallback(
    (action: WidgetAction, draftId?: string) => {
      if (action.kind === 'navigate' && action.route) {
        if (action.route.includes('$draftId')) {
          if (draftId) {
            void navigate({
              to: '/espacio/borrador/$draftId',
              params: { draftId },
            });
          }
          return;
        }
        const needsPatient =
          action.route.startsWith('/espacio/') && action.route !== '/espacio/buscar-paciente';
        void navigate({
          to: action.route as Exclude<
            ClinicalNavigateTarget,
            '/espacio/borrador/$draftId' | '/epis2/dashboard'
          >,
          ...(needsPatient && patientId ? { search: { patientId } } : {}),
        });
        return;
      }

      if (action.kind === 'command' && action.command) {
        const intent = action.command as ClinicalIntent;
        const path = INTENT_ROUTE_PATHS[intent];
        if (!path) return;
        if (path.startsWith('/epis2/dashboard')) {
          const tab = (DASHBOARD_TAB_BY_INTENT[intent] ?? 'work') as DashboardTab;
          void navigate({
            to: '/epis2/dashboard',
            search: {
              tab,
              ...(patientId && tab === 'patient' ? { patientId } : {}),
            },
          });
          return;
        }
        void navigate({
          to: path as ClinicalFormRoutePath | '/espacio/ficha',
          ...(patientId ? { search: { patientId } } : {}),
        });
      }
    },
    [navigate, patientId],
  );
}
