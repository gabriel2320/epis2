/**
 * ADR-002 — E2E dual chart modes (opt-in CI: VITE_ENABLE_DUAL_CHART_MODES=true).
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Dual chart modes ADR-002', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      process.env.VITE_ENABLE_DUAL_CHART_MODES !== 'true',
      'Requiere VITE_ENABLE_DUAL_CHART_MODES=true',
    );
    await loginAsPhysician(page);
    await page.goto('/dev/chart-modes');
    await expect(page.getByTestId('epis2-clinical-shell-v2')).toBeVisible({ timeout: 15_000 });
  });

  test('a) abre ficha electrónica tradicional', async ({ page }) => {
    await expect(page.getByTestId('epis2-traditional-ehr-mode')).toBeVisible();
    await expect(page.getByTestId('epis2-traditional-ehr-nav')).toBeVisible();
  });

  test('b) alterna a ficha papel', async ({ page }) => {
    await page.getByTestId('epis2-chart-mode-paper').click();
    await expect(page.getByTestId('epis2-paper-chart-mode')).toBeVisible();
    await expect(page.getByTestId('epis2-paper-chart-template')).toBeVisible();
  });

  test('c) edita sección anamnesis', async ({ page }) => {
    await page.getByTestId('epis2-chart-mode-paper').click();
    const field = page.getByTestId('epis2-paper-field-anamnesis');
    await field.fill('Anamnesis E2E demo');
    await expect(field).toHaveValue('Anamnesis E2E demo');
  });

  test('d) previsualiza formato Carta', async ({ page }) => {
    await page.getByTestId('epis2-chart-mode-paper').click();
    await page.getByTestId('epis2-paper-format-letter').click();
    await expect(page.getByTestId('epis2-paper-chart-template')).toBeVisible();
  });

  test('e) previsualiza formato A5', async ({ page }) => {
    await page.getByTestId('epis2-chart-mode-paper').click();
    await page.getByTestId('epis2-paper-format-a5').click();
    await expect(page.getByTestId('epis2-paper-chart-template')).toBeVisible();
  });

  test('f) barra de comandos en ambos modos', async ({ page }) => {
    await expect(page.getByTestId('epis2-chart-command-bar')).toBeVisible();
    await page.getByTestId('epis2-chart-mode-paper').click();
    await expect(page.getByTestId('epis2-chart-command-bar')).toBeVisible();
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
