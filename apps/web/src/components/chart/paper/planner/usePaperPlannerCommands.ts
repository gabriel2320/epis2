import { getPaperPlannerCommandSuggestions } from '@epis2/command-registry';
import { useCallback, useMemo } from 'react';
import { useActivePatient } from '../../../../clinical/ActivePatientContext.js';
import { useClinicalCommandSubmit } from '../../../../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../../../../clinical/useCommandResolveContext.js';

/** Resolución NL agenda papel — misma vía que barra (MF-PA-07 / MF-PAPER-PLANNER-04). */
export function usePaperPlannerCommands() {
  const { patient } = useActivePatient();
  const commandContext = useCommandResolveContext('patient_chart', { chartMode: 'paper' });

  const { submit } = useClinicalCommandSubmit({
    patientId: patient?.id,
    commandContext,
  });

  const phrases = useMemo(() => getPaperPlannerCommandSuggestions(), []);

  const runPhrase = useCallback(
    (text: string) => {
      void submit(text);
    },
    [submit],
  );

  return { phrases, runPhrase, enabled: Boolean(patient?.id) };
}
