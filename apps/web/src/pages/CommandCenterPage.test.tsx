/**

 * @vitest-environment jsdom

 */

import { copy } from '@epis2/design-system';

import { cleanup, screen, within } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';

import { renderWithQuery } from '../test/renderWithQuery.js';

import { CommandCenterPage } from './CommandCenterPage.js';



function renderCommandCenter() {

  return renderWithQuery(

    <ActivePatientProvider>

      <CommandCenterPage />

    </ActivePatientProvider>,

  );

}



vi.mock('@tanstack/react-router', () => ({

  useNavigate: () => vi.fn(),

  useRouterState: ({ select }: { select: (s: { location: { pathname: string } }) => unknown }) =>

    select({ location: { pathname: '/comando' } }),

  Link: ({ children, to, ...rest }: { children?: unknown; to: string }) => (

    <a href={to} {...rest}>

      {children}

    </a>

  ),

}));



vi.mock('../api/commandApi.js', () => ({

  resolveCommand: vi.fn(),

}));



const { fetchPatientClinicalAlerts, fetchDashboardWork } = vi.hoisted(() => ({

  fetchPatientClinicalAlerts: vi.fn(),

  fetchDashboardWork: vi.fn(),

}));



vi.mock('../api/clinicalApi.js', async (importOriginal) => {

  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();

  return {

    ...actual,

    listPatients: vi.fn().mockResolvedValue({

      patients: [

        {

          id: 'a0000001-0000-4000-8000-000000000005',

          displayName: 'Paciente Demo — Penicilina',

          demoCaseCode: 'DEMO-005',

        },

      ],

    }),

    fetchPatientClinicalAlerts,

    listDrafts: vi.fn().mockResolvedValue({ drafts: [] }),

  };

});



vi.mock('../api/dashboardApi.js', () => ({

  fetchDashboardWork: (...args: unknown[]) => fetchDashboardWork(...args),

}));



vi.mock('../api/aiApi.js', () => ({

  fetchAiStatus: vi.fn().mockResolvedValue({ available: false, ollama: 'down', localAi: 'down', message: '' }),

}));



vi.mock('../auth/AuthContext.js', () => ({

  useAuth: () => ({

    session: {

      user: {

        id: 'usr-physician-01',

        username: 'medico.demo',

        displayName: 'Dra. Ana Demo',

        role: 'physician',

      },

      permissions: ['command.execute', 'draft.approve', 'ai.read', 'dashboard.read'],

      expiresAt: new Date().toISOString(),

    },

    logout: vi.fn(),

    isAuthenticated: true,

    isLoading: false,

    login: vi.fn(),

    refreshSession: vi.fn(),

    hasPermission: (p: string) =>

      ['command.execute', 'draft.approve', 'ai.read', 'dashboard.read'].includes(p),

  }),

}));



afterEach(() => {

  cleanup();

  fetchPatientClinicalAlerts.mockReset();

  fetchDashboardWork.mockReset();

  fetchDashboardWork.mockResolvedValue({

    readOnly: true,

    myOpenDrafts: [],

    pendingReview: [{ id: 'task-1', title: 'Revisar borrador demo' }],

    demoTasks: [],

  });

});



describe('CommandCenterPage', () => {

  it('muestra pantalla de decisión compacta sin rail ni tarjetas', () => {
    renderCommandCenter();
    expect(screen.getByTestId('epis2-command-hero')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-prompt')).toHaveTextContent(copy.commandCenter.title);
    expect(screen.getByTestId('epis2-command-hero-power-bar')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-power-bar')).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-floating-command-dock')).not.toBeInTheDocument();
    expect(screen.queryByTestId('epis2-command-suggestion-cards')).not.toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-quick-chips')).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-navigation-rail')).not.toBeInTheDocument();
  });

  it('continuar trabajo visible cuando hay datos', async () => {
    renderCommandCenter();
    expect(await screen.findByTestId('epis2-command-recent-activity')).toBeInTheDocument();
    expect(screen.getByText(copy.commandCenter.continueWorkTitle)).toBeInTheDocument();
  });



  it('exige instrucción antes de continuar', async () => {

    const user = userEvent.setup();

    renderCommandCenter();

    const powerBar = screen.getByTestId('epis2-power-bar');

    await user.click(

      within(powerBar).getByRole('button', { name: copy.commandCenter.submit }),

    );

    expect(screen.getByText(copy.commandCenter.emptyCommand)).toBeInTheDocument();

  });



  it('recorridos demo quedan colapsados por defecto en dev', async () => {

    const user = userEvent.setup();

    renderCommandCenter();

    expect(screen.queryByTestId('epis2-demo-narratives')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-toggle-demo-narratives'));

    expect(screen.getByTestId('epis2-demo-narratives')).toBeInTheDocument();

  });



  it('integra hint IA en la barra inline', async () => {
    renderCommandCenter();
    expect(await screen.findByTestId('epis2-power-bar')).toBeInTheDocument();
  });

});

