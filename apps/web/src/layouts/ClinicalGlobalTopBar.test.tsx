/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithEpisApp } from '../test/renderWithEpisApp.js';
import { ClinicalGlobalTopBar } from './ClinicalGlobalTopBar.js';

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...rest }: { children?: unknown; to: string }) => (
    <a href={to} {...rest}>
      {children as string}
    </a>
  ),
  useRouterState: ({
    select,
  }: {
    select: (s: { location: { pathname: string; searchStr?: string } }) => unknown;
  }) => select({ location: { pathname: '/espacio/ficha', searchStr: '' } }),
}));

vi.mock('../dev/dualChartModesEnv.js', () => ({
  isDualChartModesEnabled: () => true,
}));

vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({
    session: {
      user: {
        id: 'usr-physician-01',
        displayName: 'Dra. Ana Demo',
        role: 'physician',
      },
      permissions: ['command.execute'],
      expiresAt: new Date().toISOString(),
    },
    logout: vi.fn(),
  }),
}));

vi.mock('../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../session/EpisSessionContext.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../session/EpisSessionContext.js')>();
  return {
    ...actual,
    useEpisSession: () => ({
      openDashboardMode: vi.fn(),
    }),
  };
});

vi.mock('../navigation/useClinicalWorkspace.js', () => ({
  useClinicalWorkspace: () => ({
    activeWorkspace: 'physician',
    definition: { labelKey: 'physician' },
  }),
}));

vi.mock('../clinical/ActivePatientContext.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../clinical/ActivePatientContext.js')>();
  return {
    ...actual,
    useActivePatient: () => ({
      patient: { id: '00000000-0000-4000-8000-000000000001' },
    }),
  };
});

afterEach(() => cleanup());

describe('ClinicalGlobalTopBar', () => {
  it('delega en ClinicalNavStrip cuando dual ficha está activa', () => {
    renderWithEpisApp(<ClinicalGlobalTopBar active="clinical" />);

    expect(screen.getByTestId('epis2-clinical-nav-strip')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-nav-census')).toHaveTextContent(copy.clinicalNav.census);
    expect(screen.getByTestId('epis2-clinical-nav-search')).toHaveTextContent(copy.clinicalNav.search);
    expect(screen.getByTestId('epis2-clinical-nav-ficha')).toHaveTextContent(copy.clinicalNav.ficha);
    expect(screen.getByTestId('epis2-clinical-nav-paper')).toHaveTextContent(copy.clinicalNav.paper);
    expect(screen.getByTestId('epis2-clinical-nav-more')).toHaveTextContent(copy.clinicalNav.more);

    expect(screen.queryByTestId('epis2-global-top-bar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('epis2-mode-switcher')).not.toBeInTheDocument();
  });
});
