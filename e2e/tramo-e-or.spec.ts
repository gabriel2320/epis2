/**
 * MF-TRAMO-E-002 — E2E tablero pabellón.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo E — Pabellón', () => {
  test('tablero pabellón — IDC 151 y tabla quirúrgica', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=or');
    await expect(page.getByTestId('epis2-or-dashboard')).toBeVisible();
    await expect(page.getByTestId('epis2-or-idc-151')).toBeVisible();
    await expect(page.getByTestId('epis2-or-surgical-schedule')).toBeVisible();
    await expect(page.getByTestId('epis2-or-surgical-schedule-rows')).toBeVisible();
  });
});
