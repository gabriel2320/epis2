/**
 * MF-154 — Journey E2E mínimo: login → comando → evolución.
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';

test.describe('Golden journey E2E — comando → evolución', () => {
  test('médico demo fija paciente y abre evolución desde Centro de Comando', async ({ page }) => {
    // Sesión vía API: /login dispara 401→/sesion-expirada en beforeLoad (apiFetch global).
    const login = await page.request.post('/api/auth/login', {
      data: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    expect(login.ok()).toBeTruthy();

    await page.goto('/comando');
    await expect(page).toHaveURL(/\/comando/);
    await expect(page.getByTestId('epis2-command-prompt')).toBeVisible();

    await page.getByTestId('epis2-toggle-patient-panel').click();
    await page.getByRole('button', { name: copy.forms.searchPatients }).click();
    await page.getByRole('button', { name: 'DEMO-001' }).click();
    await expect(page).toHaveURL(/\/espacio\/ficha/);

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
