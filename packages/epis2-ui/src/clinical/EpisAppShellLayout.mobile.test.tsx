/**
 * @vitest-environment jsdom
 *
 * MF-NORM-403 — bajo el breakpoint medium (<768px) el rail colapsa a un
 * Drawer modal MD3 con trigger de menú; en medium+ el rail sigue anclado.
 */
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HomeIcon from '@mui/icons-material/Home';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisAppShellLayout } from './EpisAppShellLayout.js';
import type { EpisNavigationRailItem } from './EpisNavigationRail.js';

// MUI captura window.matchMedia al evaluar el módulo: hay que definirlo antes de los imports.
const viewport = vi.hoisted(() => {
  const state = { kind: 'medium' as 'compact' | 'medium' };
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      // compactOnly usa max-width; mediumUp/expandedUp usan min-width.
      matches: state.kind === 'compact' ? query.includes('max-width') : query.includes('min-width'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  return state;
});

function buildItems(onHome: () => void): EpisNavigationRailItem[] {
  return [
    {
      id: 'home',
      label: 'Centro de comando',
      icon: <HomeIcon />,
      onClick: onHome,
      'data-testid': 'epis2-nav-home',
    },
    { id: 'sep', label: '', variant: 'divider' },
    { id: 'agenda', label: 'Agenda', active: true, 'data-testid': 'epis2-nav-agenda' },
  ];
}

function renderShell(items: EpisNavigationRailItem[]) {
  return render(
    <Epis2ThemeProvider>
      <EpisAppShellLayout railItems={items} appBar={<div>Barra superior</div>}>
        <div>Contenido</div>
      </EpisAppShellLayout>
    </Epis2ThemeProvider>,
  );
}

describe('EpisAppShellLayout — navegación móvil (MF-NORM-403)', () => {
  beforeEach(() => {
    viewport.kind = 'medium';
  });

  // globals:false en vitest.config → sin auto-cleanup de Testing Library.
  afterEach(cleanup);

  it('en medium+ muestra el rail y no el trigger móvil', () => {
    renderShell(buildItems(vi.fn()));

    expect(screen.getByTestId('epis2-navigation-rail')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Abrir navegación' })).not.toBeInTheDocument();
  });

  it('en compact oculta el rail y abre el drawer modal desde el trigger', async () => {
    viewport.kind = 'compact';
    const onHome = vi.fn();
    renderShell(buildItems(onHome));

    expect(screen.queryByTestId('epis2-navigation-rail')).not.toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: 'Abrir navegación' });
    await userEvent.click(trigger);

    const homeItem = await screen.findByTestId('epis2-nav-home');
    expect(homeItem).toBeVisible();
    expect(screen.getByTestId('epis2-nav-agenda')).toHaveAttribute('aria-current', 'page');

    await userEvent.click(homeItem);
    expect(onHome).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByTestId('epis2-nav-home')).not.toBeInTheDocument();
    });
  });
});
