/**
 * MF-186 — Golden journey E2E pasos 6–9: borrador → aprobación → auditoría → comando.
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

test.describe('Golden journey E2E — borrador a aprobación', () => {
  test('médico guarda borrador, aprueba y vuelve al Centro de Comando', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');

    await page.goto('/comando');
    const powerBar = page.getByTestId('epis2-power-bar');
    await powerBar
      .getByRole('textbox', { name: copy.commandCenter.powerBarLabel })
      .fill('evolucionar nota de hoy');
    await powerBar.getByRole('button', { name: copy.commandCenter.submit }).click();
    await expect(page).toHaveURL(/\/espacio\/evolucion/);
    await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();

    const subjective = page.getByTestId('epis2-field-subjective-rich-input');
    await subjective.click();
    await subjective.fill('Paciente refiere mejoría del dolor abdominal.');
    await page.getByRole('button', { name: copy.forms.sign }).click();
    await expect(page).toHaveURL(/\/espacio\/borrador\//);
    await expect(page.getByTestId('epis2-draft-review')).toBeVisible();

    await page.getByTestId('epis2-draft-approve').click();
    await expect(page.getByTestId('epis2-draft-review-message')).toContainText(
      copy.drafts.approvedSuccess,
    );

    await page.goto('/comando');
    await expect(page.getByTestId('epis2-command-prompt')).toBeVisible();
    await expect(page.getByTestId('epis2-command-context-line')).toContainText('DEMO-001');
  });
});
