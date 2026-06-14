/**
 * @vitest-environment jsdom
 */
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ClinicalCdsCard, type ClinicalCdsCardProps } from './ClinicalCdsCard.js';

afterEach(() => cleanup());

function renderCard(props: ClinicalCdsCardProps) {
  return render(
    <Epis2ThemeProvider>
      <ClinicalCdsCard {...props} />
    </Epis2ThemeProvider>,
  );
}

describe('ClinicalCdsCard (MF-CU-01)', () => {
  it('renderiza variantes info, sugerencia y advertencia', () => {
    const { rerender } = renderCard({
      variant: 'info',
      label: 'Control HbA1c vencido',
      testId: 'cds-info',
    });
    expect(screen.getByTestId('cds-info')).toHaveClass('MuiAlert-outlined');
    expect(screen.getByText('Información')).toBeInTheDocument();

    rerender(
      <Epis2ThemeProvider>
        <ClinicalCdsCard variant="suggestion" label="Solicitar laboratorio" testId="cds-suggestion" />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('cds-suggestion')).not.toHaveClass('MuiAlert-outlined');
    expect(screen.getByText('Sugerencia')).toBeInTheDocument();

    rerender(
      <Epis2ThemeProvider>
        <ClinicalCdsCard variant="warning" label="Interacción medicamentosa" testId="cds-warning" />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('cds-warning')).toHaveClass('MuiAlert-outlined');
    expect(screen.getByText('Advertencia')).toBeInTheDocument();
  });

  it('muestra detalle y badge de origen CDS', () => {
    renderCard({
      variant: 'warning',
      label: 'Reacción cruzada beta-lactámico',
      detail: 'Revisar conciliación antes de prescribir.',
      source: 'cds',
      testId: 'cds-detail',
    });

    expect(screen.getByText('Revisar conciliación antes de prescribir.')).toBeInTheDocument();
    expect(screen.getByText('CDS')).toBeInTheDocument();
  });

  it('dispara onAction al pulsar la etiqueta accionable', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderCard({
      variant: 'suggestion',
      label: 'Abrir panel de laboratorio',
      onAction,
      testId: 'cds-action',
    });

    await user.click(screen.getByRole('button', { name: 'Abrir panel de laboratorio' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
