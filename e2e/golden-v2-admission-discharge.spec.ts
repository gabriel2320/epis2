/**
 * Fase B Lote 3 — Journey V2 UI: servicio, ingreso borrador, crítico INR, evolución.
 * @see docs/quality/EPIS2_GOLDEN_JOURNEYS.md §4
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

const CRITICAL_DEMO_ID = 'f0000004-0000-4000-8000-000000000001';

test.describe('Golden journey V2 UI — hospitalización', () => {
  test('servicio, ingreso borrador, acuse crítico y evolución diaria', async ({ page }) => {
    await loginAsPhysician(page);

    await page.goto('/comando');
    const powerBar = page.getByTestId('epis2-power-bar');
    await powerBar
      .getByRole('textbox', { name: copy.commandCenter.powerBarLabel })
      .fill('ver el servicio');
    await powerBar.getByRole('button', { name: copy.commandCenter.submit }).click();
    await expect(page).toHaveURL(/tab=service/);
    await expect(page.getByTestId('epis2-service-census')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-service-census-occupied')).toBeVisible();
    await expect(page.getByTestId('epis2-service-orders-grid')).toBeVisible();

    const ackButton = page.getByTestId(`epis2-ack-critical-${CRITICAL_DEMO_ID}`);
    if (await ackButton.isVisible()) {
      await ackButton.click();
      await expect(ackButton).toBeHidden({ timeout: 10_000 });
    }

    await pinDemoCase(page, 'DEMO-001');
    await page.getByTestId('epis2-longitudinal-admit-hospital').click();
    await expect(page).toHaveURL(/\/espacio\/ingreso/);
    await expect(page.getByTestId('epis2-form-admission_note')).toBeVisible();
    await page.getByLabel(/Motivo de ingreso/i).fill('Ingreso demo golden V2');
    await page.getByLabel(/Resumen clínico/i).fill('Estable para observación hospitalaria');
    await page.getByLabel(/Plan inicial/i).fill('Monitoreo y estudios complementarios');
    await page.getByLabel(/Cama destino/i).click();
    await page.getByRole('option', { name: /102A/i }).click();
    await page.getByTestId('epis2-form-save').click();
    await expect(page).toHaveURL(/\/espacio\/borrador\//, { timeout: 15_000 });
    await expect(page.getByTestId('epis2-draft-review')).toBeVisible();

    await pinDemoCase(page, 'DEMO-005');
    await page.goto('/comando');
    await powerBar
      .getByRole('textbox', { name: copy.commandCenter.powerBarLabel })
      .fill('escribir evolucion diaria');
    await powerBar.getByRole('button', { name: copy.commandCenter.submit }).click();
    await expect(page).toHaveURL(/\/espacio\/evolucion/);
    await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();
  });
});
