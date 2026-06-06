/**
 * Helpers E2E — pacientes demo sintéticos.
 */
import { copy } from '@epis2/design-system';
import { expect, type Page } from '@playwright/test';

export async function loginAsPhysician(page: Page) {
  let lastStatus = 0;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const login = await page.request.post('/api/auth/login', {
      data: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    lastStatus = login.status();
    if (login.ok()) {
      await page.goto('/comando');
      await expect(page.getByTestId('epis2-command-prompt')).toBeVisible({ timeout: 15_000 });
      return;
    }
    await page.waitForTimeout(1000);
  }
  throw new Error(`login médico demo falló (HTTP ${lastStatus})`);
}

export async function goToCommandCenter(page: Page) {
  await page.goto('/comando');
  await expect(page.getByTestId('epis2-command-prompt')).toBeVisible({ timeout: 15_000 });
}

/** Abre panel, carga lista demo y fija paciente por código DEMO-00x. */
export async function pinDemoCase(page: Page, demoCode: string) {
  await page.getByTestId('epis2-toggle-patient-panel').click();
  await expect(page.getByTestId('epis2-active-patient-panel')).toBeVisible();
  await page.getByRole('button', { name: copy.forms.searchPatients }).click();
  await page.getByRole('button', { name: demoCode }).click({ timeout: 15_000 });
  await expect(page).toHaveURL(/\/espacio\/ficha/);
}

export async function openAmbulatoryFromCommand(page: Page) {
  await goToCommandCenter(page);
  const powerBar = page.getByTestId('epis2-power-bar');
  await powerBar
    .getByRole('textbox', { name: copy.commandCenter.powerBarLabel })
    .fill('consulta ambulatoria de control');
  await powerBar.getByRole('button', { name: copy.commandCenter.submit }).click();
  await expect(page).toHaveURL(/\/espacio\/ambulatorio/);
  await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible({ timeout: 15_000 });
}
