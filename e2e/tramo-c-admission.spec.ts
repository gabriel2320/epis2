/**
 * MF-TRAMO-C-003 — E2E ingreso hospitalario desde ficha.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

test.describe('Tramo C — hospitalización', () => {
  test('ficha — CTAs hospitalización e ingreso', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.goto('/espacio/ficha?patientId=a0000001-0000-4000-8000-000000000001');
    await expect(page.getByTestId('epis2-longitudinal-hospitalization')).toBeVisible();
    await expect(page.getByTestId('epis2-longitudinal-admit-hospital')).toBeVisible();
    await page.getByTestId('epis2-longitudinal-admit-hospital').click();
    await expect(page).toHaveURL(/\/espacio\/ingreso/);
    await expect(page.getByTestId('epis2-form-admission_note')).toBeVisible();
    await expect(page.getByLabel(/Motivo de ingreso/i)).toBeVisible();
  });

  test('ficha — enlace órdenes activas servicio (MF-TRAMO-C-004)', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.goto('/espacio/ficha?patientId=a0000001-0000-4000-8000-000000000001');
    await page.getByTestId('epis2-longitudinal-open-service-orders').click();
    await expect(page).toHaveURL(/tab=service/);
    await expect(page.getByTestId('epis2-dashboard-tab-service')).toBeVisible();
  });

  test('ficha — enlace censo servicio (MF-TRAMO-C-007)', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.goto('/espacio/ficha?patientId=a0000001-0000-4000-8000-000000000001');
    await page.getByTestId('epis2-longitudinal-open-service-census').click();
    await expect(page).toHaveURL(/tab=service/);
    await expect(page.getByTestId('epis2-service-census')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-service-census-occupied')).toBeVisible();
  });
});
