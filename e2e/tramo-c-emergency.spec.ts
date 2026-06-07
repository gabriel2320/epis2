/**
 * MF-TRAMO-C-002 — E2E tablero urgencias (IDC 101+).
 * MF-TRAMO-C-006 — CTA epicrisis urgencias (IDC 110).
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo C — urgencias', () => {
  test('tablero urgencias — triaje e IDC 101', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=emergency');
    await expect(page.getByTestId('epis2-emergency-dashboard')).toBeVisible();
    await expect(page.getByTestId('epis2-emergency-idc-101')).toBeVisible();
    await expect(page.getByTestId('epis2-emergency-triage-queue')).toBeVisible();
  });

  test('tablero urgencias — epicrisis desde observación (IDC 110)', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=emergency');
    await expect(page.getByTestId('epis2-emergency-discharge-actions')).toBeVisible();
    await expect(page.getByTestId('epis2-emergency-idc-110')).toBeVisible();
    const epicrisisCta = page.locator('[data-testid^="epis2-emergency-prepare-epicrisis-"]').first();
    await expect(epicrisisCta).toBeVisible();
    await epicrisisCta.click();
    await expect(page).toHaveURL(/\/espacio\/epicrisis/);
    await expect(page.getByTestId('epis2-form-discharge_summary')).toBeVisible({ timeout: 15_000 });
  });
});
