/**
 * Helpers E2E — pacientes demo sintéticos.
 */
import { copy } from '@epis2/design-system';
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { expect, type Page } from '@playwright/test';

export async function loginAsPhysician(page: Page) {
  const login = await page.request.post('/api/auth/login', {
    data: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
  });
  if (!login.ok()) {
    throw new Error(`login médico demo falló (HTTP ${login.status()})`);
  }
  const state = await page.request.storageState();
  await page.context().addCookies(state.cookies);
  await page.goto('/comando');
  await expect(page.getByTestId('epis2-command-hero')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-command-prompt')).toBeVisible();
  await expect(page.getByTestId('epis2-power-bar')).toBeVisible();
}

export async function goToCommandCenter(page: Page) {
  await page.goto('/comando');
  await expect(page.getByTestId('epis2-command-hero')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-power-bar')).toBeVisible();
}

/** Fija paciente demo por código DEMO-00x — navegación directa a ficha. */
export async function pinDemoCase(page: Page, demoCode: string) {
  const demo = getDemoCaseByCode(demoCode);
  if (!demo) {
    throw new Error(`demoCode desconocido: ${demoCode}`);
  }
  await page.goto(`/espacio/ficha?patientId=${demo.patientId}`);
  await expect(page.getByTestId('epis2-patient-workspace')).toBeVisible({ timeout: 15_000 });
}

/** Flujo UI Buscar → grid demo (alternativa cuando hace falta recorrer la búsqueda). */
export async function selectDemoPatientViaSearch(page: Page, demoCode: string) {
  await page.getByTestId('epis2-nav-buscar').click();
  await expect(page).toHaveURL(/\/espacio\/buscar-paciente/);
  await page.getByRole('button', { name: copy.forms.searchPatients }).click();
  await page.getByRole('button', { name: demoCode }).click();
  await expect(page).toHaveURL(/\/espacio\/ficha/);
  await expect(page.getByTestId('epis2-patient-workspace')).toBeVisible({ timeout: 15_000 });
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

export async function clickModeSwitcher(
  page: Page,
  mode: 'command' | 'classic' | 'dashboard',
) {
  await page.getByTestId(`epis2-mode-switcher-${mode}`).click();
}
