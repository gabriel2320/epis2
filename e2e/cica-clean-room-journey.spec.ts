/**
 * CICA Clean Room — journey E2E sobre rutas /app/* (sala blanca).
 * @see docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md
 */
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { test, expect } from '@playwright/test';
import {
  getCicaPatientSearchInput,
  loginAsPhysicianCica,
  openCicaChartTab,
  pinCicaDemoCase,
  selectCicaDemoPatientViaSearch,
} from './helpers/demoPatient.js';

test.describe('CICA Clean Room — /app journey', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPhysicianCica(page);
  });

  test('buscar → ficha resumen expone panel clásico y tabs CICA', async ({ page }) => {
    await expect(page.getByTestId('cica-app-shell')).toBeVisible();
    await expect(page.getByTestId('cica-patient-search-hero')).toBeVisible();
    await expect(getCicaPatientSearchInput(page)).toBeVisible();
    await expect(page.getByTestId('cica-patient-search-submit')).toBeVisible();

    await selectCicaDemoPatientViaSearch(page, 'DEMO-001');

    await expect(page.getByTestId('cica-patient-summary-screen')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('cica-chart-tabs')).toBeVisible();
    await expect(page.getByTestId('cica-classic-summary-panel')).toBeVisible();
    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();

    const summaryBlocks = page.locator(
      '[data-testid="cica-classic-summary-panel-diagnoses"], [data-testid="cica-classic-summary-panel-evolution"], [data-testid="cica-classic-summary-panel-orders"], [data-testid="cica-classic-summary-panel-exams"], [data-testid="cica-classic-summary-panel-documents"]',
    );
    await expect(summaryBlocks).toHaveCount(5);

    await expect(page.getByTestId('epis2-dual-chart-ficha')).toHaveCount(0);
    await expect(page.getByTestId('epis2-mode-switcher-command')).toHaveCount(0);
  });

  test('pinCicaDemoCase abre ficha resumen sin shell legacy', async ({ page }) => {
    await pinCicaDemoCase(page, 'DEMO-001');
    await expect(page).toHaveURL(/\/app\/pacientes\/.+\/resumen/);
    await expect(page.getByTestId('cica-patient-summary-screen')).toBeVisible();
    await expect(page.getByTestId('cica-chart-tab-resumen')).toBeVisible();
  });

  test('tab Evoluciones navega a /app/pacientes/:id/evoluciones', async ({ page }) => {
    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');

    await pinCicaDemoCase(page, 'DEMO-001');
    await openCicaChartTab(page, 'evoluciones');

    await expect(page).toHaveURL(new RegExp(`/app/pacientes/${demo.patientId}/evoluciones`));
    await expect(page.getByTestId('cica-patient-evolutions-screen')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('cica-evolutions-list')).toBeVisible();
    await expect(page.getByTestId('cica-chart-tabs')).toBeVisible();
    await expect(page.getByTestId('cica-chart-tab-evoluciones')).toBeVisible();
  });

  test('ruta directa resumen carga panel y tabs', async ({ page }) => {
    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');

    await page.goto(`/app/pacientes/${demo.patientId}/resumen`);
    await expect(page).toHaveURL(new RegExp(`/app/pacientes/${demo.patientId}/resumen`), {
      timeout: 15_000,
    });
    await expect(page.getByTestId('cica-patient-summary-screen')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('cica-classic-summary-panel')).toBeVisible();
    await expect(page.getByTestId('cica-chart-tabs')).toBeVisible();
  });
});
