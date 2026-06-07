/**
 * MF-TRAMO-C-005 — E2E tendencias clínicas en bandeja resultados.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

const DEMO005_PATIENT_ID = 'a0000001-0000-4000-8000-000000000005';

test.describe('Tramo C — tendencias resultados', () => {
  test('bandeja DEMO-005 muestra gráficos INR/PCR', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-005');
    await page.goto(`/espacio/resultados?patientId=${DEMO005_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-results-inbox')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-results-trends')).toBeVisible();
    await expect(page.getByTestId('epis2-results-chart-inr')).toBeVisible();
  });
});
