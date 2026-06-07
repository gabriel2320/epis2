/**
 * MF-TRAMO-C-008 — E2E MAR enfermería desde ficha y tablero.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

const MAR_ID = 'f0000006-0000-4000-8000-000000000001';

test.describe('Tramo C — MAR enfermería', () => {
  test('ficha — enlace bandeja MAR enfermería', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-005');
    await page.getByTestId('epis2-longitudinal-open-nursing-mar').click();
    await expect(page).toHaveURL(/tab=nursing/);
    await expect(page.getByTestId('epis2-dashboard-tab-nursing')).toBeVisible();
    await expect(page.getByTestId('epis2-dashboard-nursing')).toBeVisible();
  });

  test('tablero enfermería — registrar MAR abre formulario', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=nursing');
    await expect(page.getByTestId('epis2-dashboard-nursing')).toBeVisible({ timeout: 15_000 });
    const registerMar = page.getByTestId(`epis2-nursing-register-mar-${MAR_ID}`);
    if (await registerMar.isVisible()) {
      await registerMar.click();
      await expect(page).toHaveURL(/\/espacio\/mar/);
      await expect(page.getByTestId('epis2-form-medication_administration')).toBeVisible({
        timeout: 15_000,
      });
    } else {
      await expect(page.getByTestId(`epis2-nursing-mar-${MAR_ID}`)).toBeVisible();
    }
  });
});
