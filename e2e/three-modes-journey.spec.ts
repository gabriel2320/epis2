/**
 * MF-THREE-MODES-07 — Journey E2E: comando → classic → dashboard → classic con returnTo.
 * @see docs/product/EPIS2_THREE_MODES_DEV_PLAN.md
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

test.describe('PROG-THREE-MODES — journey E2E', () => {
  test('comando → classic → dashboard → classic con mode= canónico', async ({ page }) => {
    await loginAsPhysician(page);

    await pinDemoCase(page, 'DEMO-001');

    await page.getByTestId('epis2-mode-switcher-classic').click();
    await expect(page).toHaveURL(/mode=classic/, { timeout: 15_000 });
    await expect(page).toHaveURL(/patientId=/);
    await expect(page.getByTestId('epis2-clinical-shell-classic')).toBeVisible();

    await page.getByTestId('epis2-mode-switcher-command').click();
    await expect(page).toHaveURL(/\/comando/, { timeout: 15_000 });

    await page.getByTestId('epis2-mode-switcher-dashboard').click();
    await expect(page).toHaveURL(/mode=dashboard/, { timeout: 15_000 });
    await expect(page).toHaveURL(/tab=work/);
    await expect(page.getByTestId('epis2-dashboard-md3-shell')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('epis2-mode-switcher-classic').click();
    await expect(page).toHaveURL(/mode=classic/, { timeout: 15_000 });
    await expect(page).toHaveURL(/returnTo=dashboard/);
    await expect(page.getByTestId('epis2-clinical-shell-classic')).toBeVisible();
  });
});
