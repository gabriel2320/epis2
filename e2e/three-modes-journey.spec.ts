/**
 * MF-THREE-MODES-07 — Journey E2E: censo → ficha → tablero secundario → ficha con returnTo.
 * Dual ficha (ADR-002): navegación por rutas clínicas, sin switcher deprecado visible.
 * @see docs/product/EPIS2_THREE_MODES_DEV_PLAN.md
 */
import { test, expect } from '@playwright/test';
import {
  getDemoCaseByCode,
  goToCommandCenter,
  loginAsPhysician,
  pinDemoCase,
  selectDemoPatientViaSearch,
} from './helpers/demoPatient.js';

test.describe('PROG-THREE-MODES — journey E2E', () => {
  test('censo → ficha → tablero → ficha con returnTo canónico', async ({ page }) => {
    await loginAsPhysician(page);

    await selectDemoPatientViaSearch(page, 'DEMO-001');
    await expect(page).toHaveURL(/patientId=/, { timeout: 15_000 });
    await expect(page).toHaveURL(/chartMode=traditional|mode=classic/);
    await expect(
      page
        .getByTestId('epis2-dual-chart-ficha')
        .or(page.getByTestId('epis2-clinical-shell-classic')),
    ).toBeVisible();

    await goToCommandCenter(page);
    await expect(page.getByTestId('epis2-clinical-nav-strip')).toBeVisible();

    await page.goto('/epis2/dashboard?mode=dashboard&tab=work');
    await expect(page).toHaveURL(/mode=dashboard/, { timeout: 15_000 });
    await expect(page).toHaveURL(/tab=work/);
    await expect(page.getByTestId('epis2-dashboard-md3-shell')).toBeVisible({ timeout: 15_000 });

    const demo = getDemoCaseByCode('DEMO-001');
    expect(demo).toBeTruthy();
    await page.goto(
      `/espacio/ficha?patientId=${demo!.patientId}&chartMode=traditional&returnTo=dashboard`,
    );
    await expect(page).toHaveURL(/patientId=/, { timeout: 15_000 });
    await expect(page).toHaveURL(/returnTo=dashboard|chartMode=traditional/);
    await expect(
      page
        .getByTestId('epis2-dual-chart-ficha')
        .or(page.getByTestId('epis2-clinical-shell-classic')),
    ).toBeVisible();
  });

  test('pinDemoCase abre ficha dual sin switcher legacy', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('epis2-mode-switcher-deprecated-banner')).toHaveCount(0);
    await expect(page.getByTestId('epis2-clinical-nav-strip')).toBeVisible();
  });
});
