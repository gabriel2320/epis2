/**
 * MF-OLA3-002 — Journey ficha → antecedentes y bandeja.
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

test.describe('Ola 3 — ficha longitudinal CTAs', () => {
  test('ficha enlaza registro de alergia cuando vacío', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    const register = page.getByTestId('epis2-longitudinal-register-allergy');
    if (await register.isVisible()) {
      await register.click();
      await expect(page).toHaveURL(/\/espacio\/alergia/);
      await expect(page.getByTestId('epis2-form-allergy_entry')).toBeVisible();
    }
  });

  test('ficha enlaza registro de problema cuando vacío', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    const register = page.getByTestId('epis2-longitudinal-register-problem');
    if (await register.isVisible()) {
      await register.click();
      await expect(page).toHaveURL(/\/espacio\/problema/);
      await expect(page.getByTestId('epis2-form-clinical_problem_entry')).toBeVisible();
    }
  });

  test('ficha abre bandeja de resultados', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.getByTestId('epis2-longitudinal-open-results').click();
    await expect(page).toHaveURL(/\/espacio\/resultados/);
    await expect(page.getByTestId('epis2-results-inbox')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(copy.results.inboxTitle)).toBeVisible();
  });
});
