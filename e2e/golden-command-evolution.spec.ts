/**
 * MF-154 — Journey E2E mínimo: login → comando → evolución.
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

test.describe('Golden journey E2E — comando → evolución', () => {
  test('médico demo fija paciente y abre evolución desde Centro de Comando', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');

    await page.goto('/comando');
    await expect(page.getByTestId('epis2-command-prompt')).toBeVisible();

    const powerBar = page.getByTestId('epis2-power-bar');
    await powerBar
      .getByRole('textbox', { name: copy.commandCenter.powerBarLabel })
      .fill('evolucionar nota de hoy');
    await powerBar.getByRole('button', { name: copy.commandCenter.submit }).click();

    await expect(page).toHaveURL(/\/espacio\/evolucion/);
    await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();
  });
});
