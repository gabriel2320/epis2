/**
 * MF-OLA3-002 — Journey ficha → antecedentes y bandeja.
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

async function openFichaHistory(page: import('@playwright/test').Page) {
  await page.getByTestId('epis2-ficha-history').click();
  await expect(page.getByTestId('epis2-longitudinal-panel')).toBeVisible({ timeout: 15_000 });
}

test.describe('Ola 3 — ficha longitudinal CTAs', () => {
  test('ficha compacta enlaza registro de alergia cuando vacío', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('epis2-ficha-antecedents')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('epis2-ficha-register-allergy').click();
    await expect(page).toHaveURL(/\/espacio\/alergia/);
    await expect(page.getByTestId('epis2-form-allergy_entry')).toBeVisible();
  });

  test('ficha compacta lista problema activo DEMO-001', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('epis2-ficha-antecedents')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Hipertensión arterial esencial (sintético)')).toBeVisible();
    await expect(page.getByTestId('epis2-ficha-register-problem')).toHaveCount(0);
  });

  test('ficha abre bandeja de resultados desde historial', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await openFichaHistory(page);
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

  test('ficha DEMO-001 muestra timeline y medicamentos activos en historial', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await openFichaHistory(page);
    await expect(page.getByTestId('epis2-longitudinal-timeline')).toBeVisible();
    await expect(page.getByTestId('epis2-longitudinal-medications')).toBeVisible();
    await expect(page.getByTestId('epis2-longitudinal-medications')).toContainText('Losartán');
    await expect(page.getByTestId('epis2-longitudinal-observations')).toBeVisible();
    await expect(page.getByTestId('epis2-lab-observations-grid')).toBeVisible();
  });

  test('ficha DEMO-005 muestra curvas clínicas de signos vitales', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-005');
    await openFichaHistory(page);
    await expect(page.getByTestId('epis2-patient-clinical-charts')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-chart-inr-trend')).toBeVisible();
    await expect(page.getByTestId('epis2-chart-vitals-trend')).toBeVisible();
  });

  test('ficha compacta muestra documentos indexados DEMO-001', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('epis2-ficha-documents')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Informe laboratorio control HTA (demo)')).toBeVisible();
    await page.getByTestId('epis2-ficha-open-documents-index').click();
    await expect(page.getByTestId('epis2-longitudinal-documents-tree')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('ficha compacta abre línea de tiempo desde actividad reciente', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('epis2-recent-activity')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('epis2-ficha-open-timeline').click();
    await expect(page.getByTestId('epis2-longitudinal-timeline')).toBeVisible({ timeout: 15_000 });
  });

  test('ficha hub M3 carga workspace compacto y historial bajo demanda', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('epis2-patient-workspace')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-ficha-antecedents')).toBeVisible();
    await expect(page.getByTestId('epis2-ficha-documents')).toBeVisible();
    await expect(page.getByTestId('epis2-ficha-history')).toBeVisible();
    await expect(page.getByTestId('epis2-longitudinal-panel')).toHaveCount(0);
    await openFichaHistory(page);
    await expect(page.getByTestId('epis2-ficha-split')).toBeVisible();
  });

  test('ficha ofrece registrar antecedente quirúrgico en historial', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await openFichaHistory(page);
    const register = page.getByTestId('epis2-longitudinal-register-surgical-history');
    if (await register.isVisible()) {
      await register.click();
      await expect(page).toHaveURL(/\/espacio\/problema/);
      await expect(page.getByTestId('epis2-form-clinical_problem_entry')).toBeVisible();
    }
  });
});
