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

  test('ficha DEMO-005 muestra banner de alertas clínicas', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-005');
    await expect(page.getByTestId('epis2-clinical-alerts')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(copy.commandCenter.clinicalAlertsTitle)).toBeVisible();
  });

  test('ficha DEMO-001 muestra timeline y medicamentos activos', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('epis2-longitudinal-panel')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-longitudinal-timeline')).toBeVisible();
    await expect(page.getByTestId('epis2-longitudinal-medications')).toBeVisible();
    await expect(page.getByTestId('epis2-longitudinal-medications')).toContainText('Losartán');
    await expect(page.getByTestId('epis2-longitudinal-observations')).toBeVisible();
    await expect(page.getByTestId('epis2-lab-observations-grid')).toBeVisible();
  });

  test('ficha DEMO-005 muestra curvas clínicas de signos vitales', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-005');
    await expect(page.getByTestId('epis2-patient-clinical-charts')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-chart-inr-trend')).toBeVisible();
    await expect(page.getByTestId('epis2-chart-vitals-trend')).toBeVisible();
  });

  test('ficha hub M3 carga workspace y panel longitudinal', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('epis2-patient-workspace')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-ficha-widget-panel')).toBeVisible();
    await expect(page.getByTestId('epis2-longitudinal-panel')).toBeVisible();
  });

  test('ficha ofrece registrar antecedente quirúrgico', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    const register = page.getByTestId('epis2-longitudinal-register-surgical-history');
    if (await register.isVisible()) {
      await register.click();
      await expect(page).toHaveURL(/\/espacio\/problema/);
      await expect(page.getByTestId('epis2-form-clinical_problem_entry')).toBeVisible();
    }
  });
});
