import { classicCommandSuggestionLabels } from '../../classic-md3/commandSuggestions.js';
import { useClinicalCommandSubmit } from '../../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../../clinical/useCommandResolveContext.js';
import { useActivePatient } from '../../clinical/ActivePatientContext.js';
import { EpisUniversalCommandBar } from '../command/EpisUniversalCommandBar.js';

/** Command bar transversal en rutas /espacio/* (excluye ficha con ClinicalShell propio). */
export function ChartEspacioCommandDock() {
  const { patient } = useActivePatient();
  const patientId = patient?.id;
  const commandContext = useCommandResolveContext('patient_chart');
  const command = useClinicalCommandSubmit({
    ...(patientId ? { patientId } : {}),
    commandContext,
  });

  if (!patientId) return null;

  return (
    <EpisUniversalCommandBar
      variant="classic-contextual"
      embedded
      query={command.query}
      onQueryChange={command.setQuery}
      onSubmit={() => void command.submit()}
      suggestions={classicCommandSuggestionLabels(command.lastResult)}
      onSuggestionSelect={(label) => void command.submit(label)}
      testId="epis2-espacio-chart-command-bar"
    />
  );
}
