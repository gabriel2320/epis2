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

  test('tablero UCI — vías invasivas IDC 45', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-invasive-lines')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-invasive-lines-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-45')).toBeVisible();
  });

  test('tablero UCI — valoración neurológica IDC 46', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-neurological')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-neurological-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-46')).toBeVisible();
  });

  test('tablero UCI — escalas severidad IDC 47', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-severity-scales')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-severity-scales-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-47')).toBeVisible();
  });

  test('tablero UCI — titulación vasoactivos IDC 48', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-vasoactive')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-vasoactive-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-48')).toBeVisible();
  });

  test('tablero UCI — sedoanalgesia IDC 49', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-sedoanalgesia')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-sedoanalgesia-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-49')).toBeVisible();
  });

  test('tablero UCI — epicrisis traslado IDC 50', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-discharge-actions')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-50')).toBeVisible();
    const epicrisisCta = page.locator('[data-testid^="epis2-icu-prepare-epicrisis-"]').first();
    await expect(epicrisisCta).toBeVisible();
    await epicrisisCta.click();
    await expect(page).toHaveURL(/\/espacio\/epicrisis/);
    await expect(page.getByTestId('epis2-form-discharge_summary')).toBeVisible({ timeout: 15_000 });
  });
});
