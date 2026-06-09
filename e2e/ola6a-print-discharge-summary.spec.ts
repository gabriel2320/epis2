/**
 * P1 PEND-006 — Journey epicrisis → vista impresión Carta vertical (norma §19.1).
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

const DEMO001_PATIENT_ID = 'a0000001-0000-4000-8000-000000000001';

test.describe('Ola 6A — impresión epicrisis Carta', () => {
  test('epicrisis expone CTA impresión y renderiza vista Carta', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/espacio/epicrisis?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-form-discharge_summary')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-print-preview-discharge_summary')).toBeVisible({
      timeout: 15_000,
    });

    await page.evaluate(() => {
      sessionStorage.setItem(
        'epis2_print_preview:discharge_summary',
        JSON.stringify({
          diagnoses: 'Neumonía adquirida en comunidad',
          dischargeDate: '2026-06-09',
          hospitalizationSummary: 'Hospitalización de 5 días con buena evolución (demo)',
          evolution: 'Afebril desde el día 3',
          dischargeMedications: 'Amoxicilina 500 mg c/8 h por 7 días',
          instructions: 'Reposo relativo, control de temperatura',
          followUpPlan: 'Control con médico tratante en 7 días',
        }),
      );
    });
    await page.goto(`/espacio/epicrisis/imprimir?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-discharge-summary-print-page')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-print-letter-document')).toBeVisible();
    await expect(page.getByText(copy.print.dischargeSummaryTitle)).toBeVisible();
    await expect(page.getByTestId('epis2-print-document-status')).toContainText('BORRADOR');
    await expect(page.getByText('Neumonía adquirida en comunidad')).toBeVisible();
    await expect(page.getByTestId('epis2-print-execute')).toBeVisible();
  });
});
