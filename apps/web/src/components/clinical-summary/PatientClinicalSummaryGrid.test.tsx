/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PatientClinicalSummaryGrid } from './PatientClinicalSummaryGrid.js';

describe('PatientClinicalSummaryGrid', () => {
  it('renderiza secciones Ahora y Contexto con tarjetas MD3', () => {
    render(
      <PatientClinicalSummaryGrid
        summaryFields={{
          recentEvents: 'Consulta hace 2 h (demo)',
          activeMedications: 'Warfarina 5 mg (demo)',
        }}
        longitudinal={{
          patientId: 'a0000001-0000-4000-8000-000000000005',
          readOnly: true,
          demoCaseCode: 'DEMO-005',
          problems: [],
          allergies: [{ id: 'a1', substance: 'Penicilina', severity: 'moderate', status: 'active' }],
          medications: [],
          observations: [],
          documents: [],
          encounters: [],
          timeline: [
            {
              id: 't1',
              kind: 'encounter',
              at: new Date().toISOString(),
              title: 'Consulta demo',
            },
          ],
        }}
        alerts={[
          {
            ruleId: 'demo',
            severity: 'critical',
            message: 'Alerta crítica demo',
            detail: 'Detalle',
            source: 'cds',
          },
        ]}
      />,
    );

    expect(screen.getByTestId('epis2-clinical-summary-grid')).toBeInTheDocument();
    expect(screen.getByText(copy.clinicalSummary.nowSection)).toBeInTheDocument();
    expect(screen.getByText(copy.clinicalSummary.contextSection)).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-summary-grid-live-alerts')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-summary-grid-recentEvents')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-summary-grid-allergies')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-summary-grid-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-summary-sticky-banner')).toBeInTheDocument();
  });

  it('renderiza zonas de medicación y labs destacados cuando hay datos estructurados', () => {
    render(
      <PatientClinicalSummaryGrid
        summaryFields={{}}
        longitudinal={{
          patientId: 'a0000001-0000-4000-8000-000000000005',
          readOnly: true,
          demoCaseCode: 'DEMO-005',
          problems: [],
          allergies: [],
          medications: [
            { id: 'm1', name: 'Warfarina', doseText: '5 mg', route: 'VO', status: 'active' },
            { id: 'm2', name: 'Morfina', doseText: '2 mg', route: 'IV', status: 'PRN' },
          ],
          observations: [
            {
              id: 'o1',
              label: 'Creatinina',
              valueText: '1.8 mg/dL',
              observedAt: '2026-06-01T10:00:00.000Z',
            },
          ],
          documents: [],
          encounters: [],
          timeline: [],
        }}
        onOpenResults={() => undefined}
      />,
    );

    expect(screen.getByTestId('epis2-clinical-summary-grid-meds-active')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-summary-grid-meds-prn')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-summary-grid-lab-o1')).toBeInTheDocument();
    expect(screen.getByText('1.8 mg/dL')).toBeInTheDocument();
  });
});
