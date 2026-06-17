import { buildCicaPath, findCicaScreenById, type CicaScreenId } from '@epis2/epis2-ui';
import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';

type PatientParams = { patientId: string };
type PaperParams = { patientId: string; date: string };
type EvolutionDetailParams = { patientId: string; evolutionId: string };

/** Navegación tipada CICA — usar en páginas /app en lugar de strings sueltos. */
export function useCicaNavigate() {
  const navigate = useNavigate();

  const go = useCallback(
    (screenId: CicaScreenId, params?: PatientParams | PaperParams | EvolutionDetailParams) => {
      const screen = findCicaScreenById(screenId);
      if (!screen) return;

      if (screenId === 'paper-day') {
        const p = params as PaperParams | undefined;
        if (!p?.patientId || !p?.date) return;
        void navigate({
          to: '/app/pacientes/$patientId/papel/dia/$date',
          params: { patientId: p.patientId, date: p.date },
        });
        return;
      }

      if (screenId === 'evolution-detail') {
        const p = params as EvolutionDetailParams | undefined;
        if (!p?.patientId || !p?.evolutionId) return;
        void navigate({
          to: '/app/pacientes/$patientId/evoluciones/$evolutionId',
          params: { patientId: p.patientId, evolutionId: p.evolutionId },
        });
        return;
      }

      if (screen.route.includes(':patientId')) {
        const p = params as PatientParams | undefined;
        if (!p?.patientId) return;
        void navigate({ to: buildCicaPath(screenId, p) });
        return;
      }

      void navigate({ to: buildCicaPath(screenId) as '/app/buscar' | '/app/censo' });
    },
    [navigate],
  );

  const goPath = useCallback(
    (path: string) => {
      void navigate({ to: path });
    },
    [navigate],
  );

  return { go, goPath };
}
