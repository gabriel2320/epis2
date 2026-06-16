/**
 * EPIS2 Clinical Layout Engine — E2E composición modo clásico.
 */
import { test, expect } from '@playwright/test';
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

test.describe('Clinical Layout Engine — classic mode', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPhysician(page);
  });

  test('ficha clásica expone clinical-screen y action bar gobernada', async ({ page }) => {
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('clinical-screen')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('classic-chart-tabs')).toBeVisible();
    await expect(page.getByTestId('clinical-action-bar')).toBeVisible();
    await expect(page.getByTestId('epis2-patient-identity-band')).toBeVisible();
    await expect(page.getByTestId('epis2-classic-summary-panel')).toBeVisible();

    const summaryBlocks = page.locator(
      '[data-testid="epis2-classic-summary-panel-diagnoses"], [data-testid="epis2-classic-summary-panel-evolution"], [data-testid="epis2-classic-summary-panel-orders"], [data-testid="epis2-classic-summary-panel-exams"], [data-testid="epis2-classic-summary-panel-documents"]',
    );
    await expect(summaryBlocks).toHaveCount(5);

    const primaryButtons = await page.locator('[data-action-kind="primary"]').count();
    expect(primaryButtons).toBeLessThanOrEqual(1);

    await expect(page.getByTestId('epis2-chart-layout-new-evolution')).toBeVisible();

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(horizontalOverflow).toBe(false);

    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();
  });

  test('ficha clásica tab Evoluciones — timeline CICA sin subnav duplicado', async ({ page }) => {
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('classic-chart-tabs')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('classic-chart-tab-evolutions').click();
    await expect(page.getByTestId('epis2-traditional-section-evolution')).toBeVisible();
    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();
    await expect(page.getByTestId('classic-chart-subnav')).toHaveCount(0);

    await expect(page.getByTestId('epis2-clinical-filterable-timeline-filter-all')).toBeVisible();
    await expect(
      page.getByTestId('epis2-clinical-filterable-timeline-filter-evolutions'),
    ).toBeVisible();
    await expect(
      page.getByTestId('epis2-clinical-filterable-timeline-filter-labs'),
    ).toHaveCount(0);
  });

  test('ficha clásica tab Indicaciones — primaria contextual CICA-L-05', async ({ page }) => {
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('classic-chart-tabs')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('classic-chart-tab-orders').click();
    await expect(page.getByTestId('epis2-traditional-section-orders')).toBeVisible();
    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();

    await expect(page.getByTestId('epis2-chart-layout-new-order')).toBeVisible();
    const primary = page.locator('[data-action-kind="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveText(/Indicación/i);
  });

  test('ficha clásica tab Exámenes — labs CICA sin subnav imagen', async ({ page }) => {
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('classic-chart-tabs')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('classic-chart-tab-exams').click();
    await expect(page.getByTestId('epis2-traditional-section-labs')).toBeVisible();
    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();
    await expect(page.getByTestId('classic-chart-subnav')).toHaveCount(0);
    await expect(page.getByTestId('epis2-traditional-section-labs-table')).toBeVisible();

    await expect(page.getByTestId('epis2-chart-layout-results')).toBeVisible();
    const primary = page.locator('[data-action-kind="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveText(/Laboratorio/i);
  });

  test('ficha clásica tab Más — medicamentos CICA activos', async ({ page }) => {
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('classic-chart-tabs')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('classic-chart-tab-more').click();
    await expect(page.getByTestId('epis2-traditional-section-meds')).toBeVisible();
    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();
    await expect(page.getByTestId('classic-chart-subnav')).toHaveCount(0);

    await expect(page.getByTestId('epis2-chart-layout-prescription')).toBeVisible();
    const primary = page.locator('[data-action-kind="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveText(/Medicamentos/i);
  });

  test('ficha clásica tab Documentos — lista CICA sin subnav', async ({ page }) => {
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('classic-chart-tabs')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('classic-chart-tab-documents').click();
    await expect(page.getByTestId('epis2-traditional-section-documents')).toBeVisible();
    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();
    await expect(page.getByTestId('classic-chart-subnav')).toHaveCount(0);

    await expect(page.getByTestId('epis2-chart-layout-documents')).toBeVisible();
    const primary = page.locator('[data-action-kind="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveText(/Documentos/i);
  });

  test('evolución CICA — breadcrumb, acción única, sin ficha embebida', async ({ page }) => {
    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');
    await page.goto(`/espacio/evolucion?patientId=${demo.patientId}&assistDraft=false`);
    await expect(page.getByTestId('epis2-cica-evolution-form')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();
    await expect(page.getByTestId('clinical-nav-back-to-ficha')).toBeVisible();
    await expect(page.getByTestId('classic-chart-tabs')).toHaveCount(0);
  });

  test('epicrisis CICA — breadcrumb, acción única, sin ficha embebida', async ({ page }) => {
    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');
    await page.goto(`/espacio/epicrisis?patientId=${demo.patientId}&assistDraft=false`);
    await expect(page.getByTestId('epis2-cica-epicrisis-form')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();
    await expect(page.getByTestId('clinical-nav-back-to-ficha')).toBeVisible();
    await expect(page.getByTestId('classic-chart-tabs')).toHaveCount(0);
  });

  test('modo papel standalone CICA — nav día y retorno seguro', async ({ page }) => {
    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');
    await pinDemoCase(page, 'DEMO-001');
    await page.goto(
      `/espacio/ficha/papel?patientId=${demo.patientId}&chartMode=paper`,
    );
    await expect(page).toHaveURL(/\/espacio\/ficha\/papel/, { timeout: 15_000 });
    await expect(page.getByTestId('epis2-paper-standalone-page')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(horizontalOverflow).toBe(false);
  });

  test('ficha clásica tab Más — auditoría CICA-L-11', async ({ page }) => {
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('classic-chart-tabs')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('classic-chart-tab-more').click();
    await expect(page.getByTestId('epis2-traditional-section-meds')).toBeVisible();
    await expect(page.getByTestId('classic-chart-subnav')).toHaveCount(0);

    await page.getByTestId('epis2-chart-layout-audit-trail').click();
    await expect(page.getByTestId('epis2-traditional-section-audit')).toBeVisible();
    await expect(page.locator('[data-cica-composition="classic"]')).toBeVisible();
    await expect(page.getByTestId('epis2-traditional-section-audit-table')).toBeVisible();

    const primary = page.locator('[data-action-kind="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveText(/Auditoría/i);
  });
});
