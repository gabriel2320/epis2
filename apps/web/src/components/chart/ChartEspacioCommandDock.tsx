import { useRouterState } from '@tanstack/react-router';
import { classicCommandSuggestionLabels } from '../../classic-md3/commandSuggestions.js';
import { useClinicalCommandSubmit } from '../../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../../clinical/useCommandResolveContext.js';
import { useActivePatient } from '../../clinical/ActivePatientContext.js';
import { isDualChartModesEnabled } from '../../dev/dualChartModesEnv.js';
import { EpisUniversalCommandBar } from '../command/EpisUniversalCommandBar.js';

/** Command bar transversal en rutas /espacio/* — censo sin paciente o ficha con paciente (E5). */
export function ChartEspacioCommandDock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCensus = pathname.startsWith('/espacio/buscar-paciente');
  const { patient } = useActivePatient();
  const patientId = patient?.id;

  const workspace = isCensus ? 'command_center' : 'patient_chart';
  const commandContext = useCommandResolveContext(workspace);
  const command = useClinicalCommandSubmit({
    ...(patientId ? { patientId } : {}),
    commandContext,
  });

  if (!isCensus && !patientId) return null;

  // UX-B.2 legacy ficha monta PatientWorkspaceCommandPanel; evitar doble barra con dual off.
  if (pathname.startsWith('/espacio/ficha') && !isDualChartModesEnabled()) return null;

  return (
    <EpisUniversalCommandBar
      variant={isCensus ? 'census-search' : 'clinical-chart'}
      embedded
      query={command.query}
      onQueryChange={command.setQuery}
      onSubmit={() => void command.submit()}
      suggestions={classicCommandSuggestionLabels(command.lastResult)}
      onSuggestionSelect={(label) => void command.submit(label)}
      testId={isCensus ? 'epis2-census-command-bar' : 'epis2-espacio-chart-command-bar'}
    />
  );
}
