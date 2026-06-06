/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisNavigationRail } from './EpisNavigationRail.js';
import { PersonSearchIcon } from '../mui/index.js';

describe('EpisNavigationRail', () => {
  it('renderiza ítems de navegación anclados', () => {
    render(
      <Epis2ThemeProvider>
        <EpisNavigationRail
          items={[
            {
              id: 'search',
              label: 'Pacientes',
              icon: <PersonSearchIcon />,
              active: true,
            },
          ]}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-navigation-rail')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-nav-rail-search')).toHaveAttribute('aria-current', 'page');
  });

  it('renderiza divisor entre secciones del rail', () => {
    render(
      <Epis2ThemeProvider>
        <EpisNavigationRail
          items={[
            { id: 'a', label: 'A', icon: <PersonSearchIcon /> },
            { id: 'div', label: '', variant: 'divider' },
            { id: 'b', label: 'B', icon: <PersonSearchIcon /> },
          ]}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-nav-rail-divider')).toBeInTheDocument();
  });
});
