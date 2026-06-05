/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import type { ClinicalAlert } from '@epis2/contracts';
import { ClinicalAlertsPanel } from './ClinicalAlertsPanel.js';

const criticalAlert: ClinicalAlert = {
  ruleId: 'beta-lactam-cross-reactivity',
  severity: 'critical',
  message: 'Cruce beta-lactámicos',
  detail: 'Revisar alergia documentada antes de prescribir.',
  source: 'cds',
};

describe('ClinicalAlertsPanel accesibilidad M3', () => {
  it('alerta crítica expone rol alert con mensaje y detalle (icono MUI + texto)', () => {
    render(
      <Epis2ThemeProvider disablePreferences>
        <ClinicalAlertsPanel alerts={[criticalAlert]} />
      </Epis2ThemeProvider>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Cruce beta-lactámicos');
    expect(alert).toHaveTextContent('Revisar alergia documentada');
    expect(screen.getByTestId('epis2-clinical-alert-beta-lactam-cross-reactivity')).toBeInTheDocument();
  });
});
