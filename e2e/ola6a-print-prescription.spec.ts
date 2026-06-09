/**
 * Hilo C P1 — Journey receta → vista impresión A5 (PEND-006).
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

const DEMO001_PATIENT_ID = 'a0000001-0000-4000-8000-000000000001';

test.describe('Ola 6A — impresión receta A5', () => {
  test('receta expone CTA impresión y renderiza vista A5', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/espacio/receta?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-form-prescription')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-print-preview-prescription')).toBeVisible({
      timeout: 15_000,
    });

    await page.evaluate(() => {
      sessionStorage.setItem(
        'epis2_print_preview:prescription',
        JSON.stringify({
          medication: 'Losartán 50 mg',
          dose: '1 comprimido',
          quantity: '30 comprimidos',
          route: 'oral|Oral',
          frequency: 'Cada 24 horas',
          duration: '30 días',
          patientInstructions: 'Tomar en la mañana con agua (demo)',
        }),
      );
    });
    await page.goto(`/espacio/receta/imprimir?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-prescription-print-page')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-print-a5-document')).toBeVisible();
    await expect(page.getByText(copy.print.prescriptionTitle)).toBeVisible();
    await expect(page.getByText('Losartán 50 mg')).toBeVisible();
    await expect(page.getByTestId('epis2-print-execute')).toBeVisible();
  });
});
