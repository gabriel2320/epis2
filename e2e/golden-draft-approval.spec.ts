/**
 * MF-186 — Golden journey E2E pasos 6–9: borrador → aprobación → auditoría → comando.
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';

test.describe('Golden journey E2E — borrador a aprobación', () => {
  test('médico guarda borrador, aprueba y vuelve al Centro de Comando', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    await page.getByLabel(copy.login.usernameLabel).click();
    await page.getByRole('option', { name: /Médico Demo/ }).click();
    await page.getByLabel(copy.login.demoKeyLabel).fill('DEMO-CLAVE-MEDICO');
    await page.getByRole('button', { name: copy.login.submit }).click();
    await expect(page).toHaveURL(/\/comando/);

    await page.getByTestId('epis2-toggle-patient-panel').click();
    await page.getByRole('button', { name: copy.forms.searchPatients }).click();
    await page.getByRole('button', { name: 'DEMO-001' }).click();
    await expect(page).toHaveURL(/\/espacio\/ficha/);

    await page.goto('/comando');
    const powerBar = page.getByTestId('epis2-power-bar');
    await powerBar
      .getByRole('textbox', { name: copy.commandCenter.powerBarLabel })
      .fill('evolucionar nota de hoy');
    await powerBar.getByRole('button', { name: copy.commandCenter.submit }).click();
    await expect(page).toHaveURL(/\/espacio\/evolucion/);

    await page.getByLabel('Subjetivo').fill('Paciente refiere mejoría del dolor abdominal.');
    await page.getByRole('button', { name: copy.forms.saveDraft }).click();
    await expect(page).toHaveURL(/\/espacio\/borrador\//);
    await expect(page.getByTestId('epis2-draft-review')).toBeVisible();

    await page.getByTestId('epis2-draft-approve').click();
    await expect(page.getByTestId('epis2-draft-review-message')).toContainText(
      copy.drafts.approvedSuccess,
    );

    await page.goto('/comando');
    await expect(page.getByTestId('epis2-command-prompt')).toBeVisible();
    await expect(page.getByTestId('epis2-active-patient-panel')).toContainText('DEMO-001');
  });
});
