/**
 * MF-TRAMO-H-002 — E2E tablero IAAS avanzada.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo H — IAAS avanzada', () => {
  test('tablero calidad — IDC 141 matriz vigilancia', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=quality');
    await expect(page.getByTestId('epis2-dashboard-quality')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-advanced-idc-panels')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-idc-141')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-surveillance-matrix')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-surveillance-matrix-rows')).toBeVisible();
  });

  test('tablero calidad — scaffold IDC 142–150', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=quality');
    await expect(page.getByTestId('epis2-iaas-mdro-alert')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-antimicrobial-monitor')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-proa')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-cvc-checklist')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-nav-prevention')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-hand-hygiene')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-outbreak-study')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-isolation-map')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-isolation-map-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-endemic-curves')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-endemic-curves-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-iaas-idc-150')).toBeVisible();
  });
});
