/**
 * MF-178 — Recorrido visual M3 (V1–V6) automatizado vía Playwright.
 * @see docs/quality/M3_VISUAL_SIGNOFF_STEPS.md
 */
import { copy } from '@epis2/design-system';
import { test, expect, type Page } from '@playwright/test';
import {
  fillTransversalCommand,
  goToCommandCenter,
  loginAsPhysician,
  pinDemoCase,
} from './helpers/demoPatient.js';

async function loginViaUi(page: Page) {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: copy.login.submit })).toBeVisible();
  await page.getByLabel(copy.login.demoKeyLabel).fill('DEMO-CLAVE-MEDICO');
  await page.getByRole('button', { name: copy.login.submit }).click();
  await expect(page).toHaveURL(/\/espacio\/buscar-paciente/, { timeout: 15_000 });
  await expect(page.getByTestId('epis2-patient-search-screen')).toBeVisible({ timeout: 15_000 });
}

async function openEvolutionForm(page: Page) {
  await pinDemoCase(page, 'DEMO-001');
  await fillTransversalCommand(page, 'evolucionar nota de hoy');
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

async function clickAccentChip(page: Page, testId: string) {
  const chip = page.getByTestId(testId);
  await chip.scrollIntoViewIfNeeded();
  await expect(chip).toBeVisible();
  await chip.click();
}

test.describe('M3 visual signoff — V1–V6', () => {
  test('V1 — preferencias MTB instantáneas sin botón Guardar', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/preferencias-apariencia');
    await expect(page.getByTestId('epis2-appearance-preferences-page')).toBeVisible();
    await expect(page.getByRole('button', { name: /guardar/i })).toHaveCount(0);

    await clickAccentChip(page, 'epis2-accent-tealBlue');
    const tealStored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('epis2-theme-preferences-v2') ?? '{}'),
    );
    expect(tealStored.accent).toBe('tealBlue');

    await clickAccentChip(page, 'epis2-accent-clinicalCalm');
    const calmStored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('epis2-theme-preferences-v2') ?? '{}'),
    );
    expect(calmStored.accent).toBe('clinicalCalm');

    await goToCommandCenter(page);
    const canvasBg = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return style.backgroundColor;
    });
    expect(canvasBg).not.toMatch(/^rgb\(0,\s*0,\s*0\)$/);
  });

  test('V2 — modo oscuro legible en censo y evolución Standard', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/preferencias-apariencia');
    await page.getByTestId('epis2-mode-dark').click();
    await goToCommandCenter(page);
    await expect(page.getByTestId('epis2-patient-search-screen')).toBeVisible();
    await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();

    await openEvolutionForm(page);
    await expect(page.getByTestId('epis2-field-subjective-rich-input')).toBeVisible();
    await expect(page.getByTestId('epis2-form-save')).toBeVisible();
    await expect(page.getByTestId('epis2-form-sign')).toBeVisible();
  });

  test('V3 — alto contraste mantiene flujo clínico', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/preferencias-apariencia');
    await page.getByTestId('epis2-contrast-high').click();
    await goToCommandCenter(page);
    await expect(page.getByTestId('epis2-patient-search-screen')).toBeVisible();

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

  test('V5 — recorrido Login → Censo → Evolución → Aprobación humana', async ({ page }) => {
    await loginViaUi(page);
    await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();
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
    await goToCommandCenter(page);
    await expect(page.getByTestId('epis2-patient-search-screen')).toBeVisible();
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
