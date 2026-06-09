/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../modes/EpisModeSwitcher.js', () => ({
  EpisModeSwitcher: () => null,
}));
import { EpisDashboardMd3Shell } from './EpisDashboardMd3Shell.js';
import { EpisDashboardMd3TopBar } from './EpisDashboardMd3TopBar.js';
import { EpisDashboardMd3ScopeBar } from './EpisDashboardMd3ScopeBar.js';
import { EpisDashboardMd3NavigationRail } from './EpisDashboardMd3NavigationRail.js';
import { EpisDashboardMd3KpiStrip } from './EpisDashboardMd3KpiStrip.js';
import { EpisDashboardMd3StatusBar } from './EpisDashboardMd3StatusBar.js';
import { DEFAULT_DASHBOARD_SCOPE } from '../../dashboard-md3/dashboardScopeFilters.js';
import { visibleDashboardNavDestinations } from '../../dashboard-md3/dashboardNavDestinations.js';
import {
  DashboardMd3CriticResultSchema,
  DashboardWorkflowResultSchema,
} from '../../design-agents/schemas.js';
import { areDesignAgentsEnabled } from '../../design-agents/designAgentsEnv.js';
import { dashboardMd3CriticAgent } from '../../design-agents/dashboardDesignAgents.js';

describe('EpisDashboardMd3Shell', () => {
  it('renderiza scaffold 100dvh', () => {
    render(
      <EpisDashboardMd3Shell
        topBar={<div data-testid="top">top</div>}
        scopeBar={<div data-testid="scope">scope</div>}
        navigationRail={<div data-testid="nav">nav</div>}
        mainGrid={<div data-testid="main">main</div>}
        statusBar={<div data-testid="status">status</div>}
      />,
    );
    const shell = screen.getByTestId('epis2-dashboard-md3-shell');
    expect(shell).toHaveAttribute('data-epis-scroll-policy', 'main-grid-only');
  });
});

describe('EpisDashboardMd3TopBar', () => {
  it('no contiene firmar ni aprobar', () => {
    render(
      <EpisDashboardMd3TopBar onBackToCommand={() => undefined} clinicianLabel="Dr. Demo" />,
    );
    expect(screen.queryByText(/firmar/i)).toBeNull();
    expect(screen.queryByText(/aprobar/i)).toBeNull();
  });
});

describe('EpisDashboardMd3ScopeBar', () => {
  it('muestra filtros', () => {
    render(<EpisDashboardMd3ScopeBar filters={DEFAULT_DASHBOARD_SCOPE} />);
    expect(screen.getByTestId('epis2-dashboard-md3-scope-bar')).toBeTruthy();
  });
});

describe('EpisDashboardMd3NavigationRail', () => {
  it('tiene máximo 7 destinos visibles', () => {
    const allowed = new Set([
      'work',
      'patient',
      'service',
      'nursing',
      'pharmacy',
      'icu',
      'quality',
    ] as const);
    const { primary } = visibleDashboardNavDestinations(allowed);
    render(
      <EpisDashboardMd3NavigationRail
        primary={primary}
        more={[]}
        activeTab="work"
        onTabChange={() => undefined}
      />,
    );
    expect(primary.length).toBeLessThanOrEqual(7);
    expect(screen.getByTestId('epis2-dashboard-md3-nav-rail')).toHaveAttribute(
      'data-epis-nav-visible-count',
      String(primary.length),
    );
  });
});

describe('EpisDashboardMd3KpiStrip', () => {
  it('KPI accionable renderiza chip', () => {
    const onClick = vi.fn();
    render(
      <EpisDashboardMd3KpiStrip
        items={[
          {
            id: 'x',
            label: 'Test',
            value: 1,
            owner: 'clinical',
            onClick,
          },
        ]}
      />,
    );
    screen.getByTestId('epis2-dashboard-md3-kpi-strip-x').click();
    expect(onClick).toHaveBeenCalled();
  });
});

describe('EpisDashboardMd3StatusBar', () => {
  it('muestra actualización y modo', () => {
    render(<EpisDashboardMd3StatusBar lastUpdatedLabel="12:00" userLabel="Demo" />);
    expect(screen.getByText(copy.dashboardMd3.statusMode)).toBeTruthy();
    expect(screen.getByText(/12:00/)).toBeTruthy();
  });
});

describe('dashboard design agents', () => {
  it('agentes off por defecto', () => {
    expect(areDesignAgentsEnabled()).toBe(false);
  });

  it('schemas dashboard validan JSON', () => {
    DashboardMd3CriticResultSchema.parse({
      score: 90,
      violations: [],
      suggestions: [],
      risk: 'low',
      shellPresent: true,
      navRailMaxSeven: true,
      detailPanePresent: true,
    });
    DashboardWorkflowResultSchema.parse({
      score: 80,
      violations: [],
      suggestions: [],
      risk: 'low',
      kpisActionable: true,
      domainHasOwner: true,
    });
  });

  it('dashboardMd3CriticAgent pasa con testIds canónicos', async () => {
    const result = await dashboardMd3CriticAgent({
      route: '/epis2/dashboard?mode=dashboard',
      pathname: '/epis2/dashboard',
      surface: 'grid',
      mode: 'dashboard',
      scrollPolicy: 'main-grid-only',
      testIds: ['epis2-dashboard-md3-shell', 'epis2-dashboard-md3-detail-pane'],
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.result.violations).toHaveLength(0);
  });
});
