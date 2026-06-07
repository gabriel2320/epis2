/**
 * MF-TRAMO-D-002/003/004 — E2E tablero UCI.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo D — UCI', () => {
  test('tablero UCI — IDC 41 y mapa camas', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-dashboard')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-41')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-bed-map')).toBeVisible();
  });

  test('tablero UCI — sábana clínica IDC 42', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-flowsheet')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-flowsheet-hours')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-42')).toBeVisible();
  });

  test('tablero UCI — hemodinámica IDC 135', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-hemodynamics')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-135')).toBeVisible();
  });

  test('tablero UCI — balance hídrico IDC 43', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-fluid-balance')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-fluid-balance-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-43')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-net-fluid-balance')).toBeVisible();
  });

  test('tablero UCI — ventilación IDC 44', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-ventilation')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-ventilation-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-44')).toBeVisible();
  });
});
