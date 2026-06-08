/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PatientRecentActivityBlock } from './PatientRecentActivityBlock.js';

afterEach(() => cleanup());

describe('PatientRecentActivityBlock', () => {
  it('abre línea de tiempo completa desde ficha compacta', async () => {
    const user = userEvent.setup();
    const onView = vi.fn();

    render(
      <Epis2ThemeProvider>
        <PatientRecentActivityBlock
          events={[
            {
              id: 't1',
              kind: 'encounter',
              at: new Date().toISOString(),
              title: 'Consulta demo',
            },
          ]}
          onViewFullTimeline={onView}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByText('Consulta demo')).toBeInTheDocument();
    await user.click(screen.getByTestId('epis2-ficha-open-timeline'));
    expect(onView).toHaveBeenCalledOnce();
    expect(screen.getByText(copy.activePatient.viewFullTimeline)).toBeInTheDocument();
  });
});
