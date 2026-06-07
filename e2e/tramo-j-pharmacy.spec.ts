/**
 * MF-TRAMO-J-002 — E2E tablero farmacia clínica.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo J — Farmacia clínica', () => {
  test('tablero farmacia — IDC 161 Y-Site', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=pharmacy');
    await expect(page.getByTestId('epis2-dashboard-pharmacy')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-idc-panels')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-idc-161')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-ysite')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-ysite-rows')).toBeVisible();
  });

  test('tablero farmacia — scaffold IDC 162–170', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=pharmacy');
    await expect(page.getByTestId('epis2-pharmacy-renal-dose')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-tdm')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-ram')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-reconciliation')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-dispensing')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-crash-cart')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-controlled-substances')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-return')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-stockout')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-stockout-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-pharmacy-idc-170')).toBeVisible();
  });
});
