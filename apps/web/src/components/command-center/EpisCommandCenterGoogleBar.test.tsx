/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EpisCommandCenterGoogleBar } from './EpisCommandCenterGoogleBar.js';

vi.mock('../../clinical/recentPatients.js', () => ({
  readRecentPatients: () => [],
}));

vi.mock('../../clinical/ActivePatientContext.js', () => ({
  useActivePatient: () => ({ patient: null, setPatient: vi.fn() }),
}));

vi.mock('../../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../../session/EpisSessionContext.js', () => ({
  useEpisSession: () => ({
    activePatientId: undefined,
    openClassicMode: vi.fn(),
    openDashboardMode: vi.fn(),
    canOpenDashboard: true,
  }),
}));

describe('EpisCommandCenterGoogleBar', () => {
  it('renderiza barra Google-like con acceso a modo clásico', () => {
    render(
      <EpisCommandCenterGoogleBar
        role="physician"
        permissions={['command.execute']}
        aiAvailable={false}
        query=""
        onQueryChange={() => undefined}
        onSubmit={() => undefined}
        onSelectSuggestion={() => undefined}
        isResolving={false}
      />,
    );
    expect(screen.getByTestId('epis2-command-google-bar')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-prompt')).toHaveTextContent(copy.commandCenter.title);
    expect(screen.getByTestId('epis2-power-bar')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-classic-access')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-open-classic')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-dashboard-access')).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-command-suggestion-cards')).not.toBeInTheDocument();
  });
});
