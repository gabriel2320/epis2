/**
 * MF-TRAMO-G-002 — E2E tablero UCI especializada.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo G — UCI especializada', () => {
  test('tablero UCI — IDC 131 prueba ventilación espontánea', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-dashboard')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-specialized-idc-panels')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-131')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-spontaneous-vent')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-spontaneous-vent-rows')).toBeVisible();
  });

  test('tablero UCI — scaffold IDC 132–140', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=icu');
    await expect(page.getByTestId('epis2-icu-idc-135')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-renal-therapy')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-parenteral-nutrition')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-enteral-nutrition')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-brain-death')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-organ-procurement')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-diary')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-diary-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-delirium')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-delirium-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-prone-protocol')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-prone-protocol-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-icu-idc-140')).toBeVisible();
  });
});
