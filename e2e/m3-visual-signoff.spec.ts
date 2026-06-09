/**
 * MF-178 — Recorrido visual M3 (V1–V6) automatizado vía Playwright.
 * @see docs/quality/M3_VISUAL_SIGNOFF_STEPS.md
 */
import { copy } from '@epis2/design-system';
import { test, expect, type Page } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

async function loginViaUi(page: Page) {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: copy.login.submit })).toBeVisible();
  await page.getByLabel(copy.login.demoKeyLabel).fill('DEMO-CLAVE-MEDICO');
  await page.getByRole('button', { name: copy.login.submit }).click();
  await expect(page).toHaveURL(/\/comando/);
}

async function openEvolutionForm(page: Page) {
  await pinDemoCase(page, 'DEMO-001');
  await page.goto('/comando');
  const powerBar = page.getByTestId('epis2-power-bar');
  await powerBar
    .getByRole('textbox', { name: copy.commandCenter.powerBarLabel })
    .fill('evolucionar nota de hoy');
  await powerBar.getByRole('button', { name: copy.commandCenter.submit }).click();
  await expect(page).toHaveURL(/\/espacio\/evolucion/);
  await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();
}

async function fillEvolutionDraft(page: Page, subjective: string) {
  const richSubjective = page.getByTestId('epis2-field-subjective-rich-input');
  await expect(richSubjective).toBeVisible();
  await richSubjective.click();
  await richSubjective.fill(subjective);
  await page.getByLabel('Análisis').fill('Evaluación demo M3 — signoff visual.');
  await page.getByLabel('Plan').fill('Plan demo M3 — seguimiento clínico.');
}

test.describe('M3 visual signoff — V1–V6', () => {
  test('V1 — preferencias MTB instantáneas sin botón Guardar', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/preferencias-apariencia');
    await expect(page.getByTestId('epis2-appearance-preferences-page')).toBeVisible();
    await expect(page.getByRole('button', { name: /guardar/i })).toHaveCount(0);

    await page.getByTestId('epis2-accent-tealBlue').click();
    const tealStored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('epis2-theme-preferences-v2') ?? '{}'),
    );
    expect(tealStored.accent).toBe('tealBlue');

    await page.getByTestId('epis2-accent-clinicalBlue').click();
    const blueStored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('epis2-theme-preferences-v2') ?? '{}'),
    );
    expect(blueStored.accent).toBe('clinicalBlue');

    await page.goto('/comando');
    const canvasBg = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return style.backgroundColor;
    });
    expect(canvasBg).not.toMatch(/^rgb\(0,\s*0,\s*0\)$/);
  });

  test('V2 — modo oscuro legible en comando y evolución Standard', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/preferencias-apariencia');
    await page.getByTestId('epis2-mode-dark').click();
    await page.goto('/comando');
    await expect(page.getByTestId('epis2-command-prompt')).toBeVisible();
    await expect(page.getByTestId('epis2-power-bar')).toBeVisible();

    await openEvolutionForm(page);
    await expect(page.getByTestId('epis2-field-subjective-rich-input')).toBeVisible();
    await expect(page.getByTestId('epis2-form-save')).toBeVisible();
    await expect(page.getByTestId('epis2-form-sign')).toBeVisible();
  });

  test('V3 — alto contraste mantiene flujo clínico', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/preferencias-apariencia');
    await page.getByTestId('epis2-contrast-high').click();
    await page.goto('/comando');
    await expect(page.getByTestId('epis2-command-prompt')).toBeVisible();

    await openEvolutionForm(page);
    await fillEvolutionDraft(page, 'Control alto contraste — texto legible.');
    await page.getByTestId('epis2-form-sign').click();
    await expect(page).toHaveURL(/\/espacio\/borrador\//);
    await expect(page.getByTestId('epis2-draft-review')).toBeVisible();
    await expect(page.getByTestId('epis2-draft-approve')).toBeVisible();
  });

  test('V4 — catálogo visual dev con roles clínicos y elevación tonal', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/desarrollo/catalogo-visual');
    await expect(page.getByTestId('epis2-visual-theme-catalog')).toBeVisible();
    await expect(page.getByText(copy.visualThemeCatalog.clinicalRolesSection)).toBeVisible();
    await expect(page.getByTestId('epis2-visual-widget-grid-demo')).toBeVisible();
    await expect(page.getByText(copy.visualThemeCatalog.proseSample)).toBeVisible();
  });

  test('V5 — recorrido Login → Comando → Evolución → Aprobación humana', async ({ page }) => {
    await loginViaUi(page);
    await expect(page.getByTestId('epis2-command-prompt')).toBeVisible();
    await openEvolutionForm(page);
    await fillEvolutionDraft(page, 'Recorrido M3 V5 — evolución demo.');
    await page.getByTestId('epis2-form-sign').click();
    await expect(page).toHaveURL(/\/espacio\/borrador\//);
    await expect(page.getByTestId('epis2-draft-review')).toBeVisible();
    await expect(page.getByTestId('epis2-draft-approve')).toBeVisible();
    await page.getByTestId('epis2-draft-approve').click();
    await expect(page.getByTestId('epis2-draft-review-message')).toContainText(
      copy.drafts.approvedSuccess,
    );
    await page.goto('/comando');
    await expect(page.getByTestId('epis2-command-prompt')).toBeVisible();
  });

  test('V6 — banner offline y reduced motion', async ({ page }) => {
    await loginAsPhysician(page);
    await openEvolutionForm(page);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await expect(page.getByTestId('epis2-offline-banner')).toBeVisible();

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.getByTestId('epis2-field-subjective-rich-input')).toBeVisible();
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await expect(page.getByTestId('epis2-offline-banner')).toHaveCount(0);
  });
});
