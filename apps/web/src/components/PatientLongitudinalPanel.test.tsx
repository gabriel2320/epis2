/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PatientLongitudinalPanel } from '../components/PatientLongitudinalPanel.js';

afterEach(() => cleanup());

const emptyLongitudinal = {
  patientId: 'p1',
  readOnly: false,
  problems: [],
  allergies: [],
  medications: [],
  observations: [],
  documents: [],
  encounters: [],
  timeline: [],
};

describe('PatientLongitudinalPanel — Ola 3 CTAs', () => {
  it('ofrece registrar alergia y problema cuando vacíos', async () => {
    const user = userEvent.setup();
    const onAllergy = vi.fn();
    const onProblem = vi.fn();
    const onResults = vi.fn();

    render(
      <Epis2ThemeProvider>
        <PatientLongitudinalPanel
          data={emptyLongitudinal}
          onRegisterAllergy={onAllergy}
          onRegisterProblem={onProblem}
          onOpenResults={onResults}
        />
      </Epis2ThemeProvider>,
    );

    await user.click(screen.getByTestId('epis2-longitudinal-register-allergy'));
    await user.click(screen.getByTestId('epis2-longitudinal-register-problem'));
    await user.click(screen.getByTestId('epis2-longitudinal-open-results'));

    expect(onAllergy).toHaveBeenCalledOnce();
    expect(onProblem).toHaveBeenCalledOnce();
    expect(onResults).toHaveBeenCalledOnce();
    expect(screen.getAllByText(copy.longitudinal.emptySection).length).toBeGreaterThan(0);
  });

  it('renderiza timeline, medicamentos y observaciones con datos demo', () => {
    render(
      <Epis2ThemeProvider>
        <PatientLongitudinalPanel
          data={{
            ...emptyLongitudinal,
            medications: [
              { id: 'm1', name: 'Losartán', doseText: '50 mg/día', route: 'oral', status: 'active' },
            ],
            observations: [
              {
                id: 'o1',
                label: 'Creatinina',
                valueText: '0.9 mg/dL',
                observedAt: '2026-06-01T10:00:00.000Z',
              },
            ],
            timeline: [
              {
                id: 't1',
                kind: 'encounter',
                at: '2026-06-01T10:00:00.000Z',
                title: 'Consulta ambulatoria',
              },
            ],
          }}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-longitudinal-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-longitudinal-timeline-item-t1')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-longitudinal-medications')).toBeInTheDocument();
    expect(screen.getByText('Losartán')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-longitudinal-observations')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-lab-observations-grid')).toBeInTheDocument();
  });

  it('separa antecedentes quirúrgicos de problemas activos', () => {
    render(
      <Epis2ThemeProvider>
        <PatientLongitudinalPanel
          data={{
            ...emptyLongitudinal,
            problems: [
              { id: 'p1', description: 'HTA', status: 'active' },
              {
                id: 'p2',
                description: '[Ant.Qx] Apendicectomía 2018',
                status: 'resolved',
              },
            ],
          }}
          onRegisterSurgicalHistory={vi.fn()}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-longitudinal-surgical-history')).toBeInTheDocument();
    expect(screen.getByText('Apendicectomía 2018')).toBeInTheDocument();
    expect(screen.getByText('HTA')).toBeInTheDocument();
  });

  it('ofrece CTAs de hospitalización e ingreso', async () => {
    const user = userEvent.setup();
    const onAdmit = vi.fn();
    const onTransfer = vi.fn();
    const onNursing = vi.fn();
    const onOrders = vi.fn();
    const onCensus = vi.fn();
    const onMar = vi.fn();

    render(
      <Epis2ThemeProvider>
        <PatientLongitudinalPanel
          data={emptyLongitudinal}
          onAdmitHospital={onAdmit}
          onTransferNote={onTransfer}
          onNursingNote={onNursing}
          onOpenServiceOrders={onOrders}
          onOpenServiceCensus={onCensus}
          onOpenNursingMar={onMar}
        />
      </Epis2ThemeProvider>,
    );

    await user.click(screen.getByTestId('epis2-longitudinal-admit-hospital'));
    await user.click(screen.getByTestId('epis2-longitudinal-transfer-note'));
    await user.click(screen.getByTestId('epis2-longitudinal-nursing-note'));
    await user.click(screen.getByTestId('epis2-longitudinal-open-service-orders'));
    await user.click(screen.getByTestId('epis2-longitudinal-open-service-census'));
    await user.click(screen.getByTestId('epis2-longitudinal-open-nursing-mar'));

    expect(onAdmit).toHaveBeenCalledOnce();
    expect(onTransfer).toHaveBeenCalledOnce();
    expect(onNursing).toHaveBeenCalledOnce();
    expect(onOrders).toHaveBeenCalledOnce();
    expect(onCensus).toHaveBeenCalledOnce();
    expect(onMar).toHaveBeenCalledOnce();
  });
});
