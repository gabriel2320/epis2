/**
 * MF-OLA1C-002 — Journey órdenes, imagenología y acuse crítico.
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import {
  fillTransversalCommand,
  loginAsPhysician,
  goToCommandCenter,
  pinDemoCase,
} from './helpers/demoPatient.js';

const DEMO004_PATIENT_ID = 'a0000001-0000-4000-8000-000000000004';
const DEMO004_PCR_CRITICAL_ID = 'f0000004-0000-4000-8000-000000000002';

test.describe('Ola 1C — resultados, órdenes e imagenología', () => {
  test('censo abre bandeja de resultados', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await goToCommandCenter(page);
    await fillTransversalCommand(page, 'ver bandeja de resultados');
    await expect(page).toHaveURL(/\/espacio\/resultados/);
    await expect(page.getByTestId('epis2-results-inbox')).toBeVisible({ timeout: 15_000 });
  });

  test('censo abre solicitud de imagenología', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await goToCommandCenter(page);
    await fillTransversalCommand(page, 'solicitar radiografía de tórax');
    await expect(page).toHaveURL(/\/espacio\/imagenologia/);
    await expect(page.getByTestId('epis2-form-imaging_request')).toBeVisible();
  });

  test('bandeja acusa resultado crítico DEMO-004', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-004');
    await page.goto(`/espacio/resultados?patientId=${DEMO004_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-results-inbox')).toBeVisible({ timeout: 15_000 });

    const ackButton = page.getByTestId(`epis2-results-ack-${DEMO004_PCR_CRITICAL_ID}`);
    if (await ackButton.isVisible()) {
      await ackButton.click();
      await expect(page.getByTestId('epis2-results-ack-notice')).toContainText(
        copy.results.acknowledgeSuccess,
      );
    } else {
      await expect(page.getByText(copy.results.acknowledged)).toBeVisible();
    }
  });
});
