/**
 * MF-TRAMO-C-002 — E2E tablero urgencias (IDC 101+).
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
});
