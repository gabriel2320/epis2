/**
 * MF-TRAMO-C-003 — E2E ingreso hospitalario desde ficha dual-chart (PROG-E2E-HYGIENE).
 */
import { test, expect } from '@playwright/test';
import {
  expectDualChartFicha,
  fillTransversalCommand,
  loginAsPhysician,
  pinDemoCase,
} from './helpers/demoPatient.js';

test.describe('Tramo C — hospitalización', () => {
  test('ficha — ingreso hospitalario vía comando transversal', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expectDualChartFicha(page);
    await fillTransversalCommand(page, 'ingreso hospitalario');
    await expect(page.getByTestId('epis2-command-confirmation-dialog')).toBeVisible({
      timeout: 15_000,
    });
    await page.getByTestId('epis2-command-confirm').click();
    await expect(page).toHaveURL(/\/espacio\/ingreso/);
    await expect(page.getByTestId('epis2-form-admission_note')).toBeVisible();
    await expect(page.getByLabel(/Motivo de ingreso/i)).toBeVisible();
  });

  test('ficha — enlace órdenes activas servicio (MF-TRAMO-C-004)', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expectDualChartFicha(page);
    await fillTransversalCommand(page, 'ver el servicio');
    await expect(page).toHaveURL(/tab=service/);
    await expect(page.getByTestId('epis2-service-orders-grid')).toBeVisible({ timeout: 15_000 });
  });

  test('ficha — enlace censo servicio (MF-TRAMO-C-007)', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expectDualChartFicha(page);
    await fillTransversalCommand(page, 'ver el servicio');
    await expect(page).toHaveURL(/tab=service/);
    await expect(page.getByTestId('epis2-service-census')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-service-census-occupied')).toBeVisible();
  });
});
