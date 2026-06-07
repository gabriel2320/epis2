/**
 * MF-TRAMO-B-002 — E2E tablero recepción (IDC 2–10).
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo B — recepción', () => {
  test('tablero recepción — paneles IDC 2–10', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=reception');
    await expect(page.getByTestId('epis2-reception-dashboard')).toBeVisible();
    await expect(page.getByTestId('epis2-reception-idc-2')).toBeVisible();
    await expect(page.getByTestId('epis2-reception-idc-10')).toBeVisible();
    await expect(page.getByTestId('epis2-reception-call-panel')).toBeVisible();
    await expect(page.getByTestId('epis2-reception-agenda')).toBeVisible();
  });
});
