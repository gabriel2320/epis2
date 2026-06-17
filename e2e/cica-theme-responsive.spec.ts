/**
 * CICA Clean Room — tema (modo oscuro + acento) en /app/buscar.
 * @see packages/epis2-ui/src/cica/CicaThemeControls.tsx
 */
import { test, expect } from '@playwright/test';
import {
  expectCicaDarkModeActive,
  expectCicaLightModeActive,
  expectCicaThemeControlsVisible,
  getEpis2ThemePreferences,
  loginAsPhysicianCica,
  openCicaAppearanceViaNavMore,
  setEpis2ThemePreferences,
  toggleCicaDarkMode,
} from './helpers/demoPatient.js';

test.describe('CICA theme — dark mode and accent', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPhysicianCica(page);
    await setEpis2ThemePreferences(page, { mode: 'light', accent: 'clinicalBlue' });
    await page.reload();
    await expect(page.getByTestId('cica-patient-search-hero')).toBeVisible({ timeout: 15_000 });
    await expectCicaThemeControlsVisible(page);
  });

  test('toggle dark mode on /app/buscar refleja modo oscuro MUI', async ({ page }) => {
    await expect(page).toHaveURL(/\/app\/buscar/);
    await expectCicaLightModeActive(page);

    await toggleCicaDarkMode(page);
    await expectCicaDarkModeActive(page);

    await toggleCicaDarkMode(page);
    await expectCicaLightModeActive(page);
  });

  test('acento clinicalCalm persiste en localStorage desde top bar', async ({ page }) => {
    const before = await getEpis2ThemePreferences(page);
    expect(before.accent).toBe('clinicalBlue');

    await page.getByTestId('cica-accent-clinicalCalm').click();

    await expect(async () => {
      const stored = await getEpis2ThemePreferences(page);
      expect(stored.accent).toBe('clinicalCalm');
    }).toPass({ timeout: 5_000 });

    const shellPrimary = await page.getByTestId('cica-app-shell').evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(shellPrimary).toBeTruthy();
  });

  test('cica-nav-more abre preferencias de apariencia', async ({ page }) => {
    await openCicaAppearanceViaNavMore(page);
    await expect(page).toHaveURL(/\/preferencias-apariencia/, { timeout: 15_000 });
    await expect(page.getByTestId('epis2-appearance-preferences-page')).toBeVisible();
    await expect(page.getByTestId('epis2-appearance-preferences')).toBeVisible();
  });

  test('cica-appearance-preferences-link abre preferencias de apariencia', async ({ page }) => {
    await page.getByTestId('cica-appearance-preferences-link').click();
    await expect(page).toHaveURL(/\/preferencias-apariencia/, { timeout: 15_000 });
    await expect(page.getByTestId('epis2-appearance-preferences-page')).toBeVisible();
    await expect(page.getByTestId('epis2-appearance-preferences')).toBeVisible();
  });
});
