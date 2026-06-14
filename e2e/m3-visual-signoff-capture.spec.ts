/**
 * Captura de evidencia visual — pasos V1–V6 (MF-178).
 * @see docs/quality/M3_VISUAL_SIGNOFF_STEPS.md
 */
import { copy } from '@epis2/design-system';
import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  fillTransversalCommand,
  goToCommandCenter,
  loginAsPhysician,
  pinDemoCase,
} from './helpers/demoPatient.js';

const evidenceDir =
  process.env.M3_VISUAL_EVIDENCE_DIR ??
  join(process.cwd(), 'reports', 'm3-visual-evidence', 'latest');

mkdirSync(evidenceDir, { recursive: true });

async function snap(page: Page, name: string) {
  await page.screenshot({
    path: join(evidenceDir, `${name}.png`),
    fullPage: true,
  });
}

async function loginViaUi(page: Page) {
  await page.goto('/login');
  await page.getByLabel(copy.login.demoKeyLabel).fill('DEMO-CLAVE-MEDICO');
  await page.getByRole('button', { name: copy.login.submit }).click();
  await expect(page).toHaveURL(/\/espacio\/buscar-paciente/, { timeout: 15_000 });
  await expect(page.getByTestId('epis2-census-command-bar')).toBeVisible({ timeout: 15_000 });
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
  await page.getByLabel('Análisis').fill('Evaluación demo M3 — pasada visual.');
  await page.getByLabel('Plan').fill('Plan demo M3 — seguimiento clínico.');
}

test.describe('M3 visual pass — captura V1–V6', () => {
  test.describe.configure({ mode: 'serial' });

  test('captura evidencia visual completa', async ({ page }) => {
    // V1 — preferencias MTB
    await loginAsPhysician(page);
    await page.goto('/preferencias-apariencia');
    await expect(page.getByTestId('epis2-appearance-preferences-page')).toBeVisible();
    await snap(page, 'v1-preferencias-clinical-blue');

    await page.getByTestId('epis2-accent-tealBlue').click();
    await snap(page, 'v1-preferencias-calm-teal');

    await goToCommandCenter(page);
    await snap(page, 'v1-comando-tras-paleta');

    // V2 — modo oscuro
    await page.goto('/preferencias-apariencia');
    await page.getByTestId('epis2-mode-dark').click();
    await snap(page, 'v2-preferencias-modo-oscuro');
    await goToCommandCenter(page);
    await snap(page, 'v2-comando-modo-oscuro');
    await openEvolutionForm(page);
    await snap(page, 'v2-evolucion-modo-oscuro');

    // V3 — alto contraste
    await page.goto('/preferencias-apariencia');
    await page.getByTestId('epis2-contrast-high').click();
    await snap(page, 'v3-preferencias-alto-contraste');
    await openEvolutionForm(page);
    await fillEvolutionDraft(page, 'Pasada visual M3 — alto contraste.');
    await page.getByTestId('epis2-form-sign').click();
    await expect(page.getByTestId('epis2-draft-review')).toBeVisible();
    await snap(page, 'v3-borrador-alto-contraste');

    // V4 — catálogo dev
    await page.goto('/desarrollo/catalogo-visual');
    await expect(page.getByTestId('epis2-visual-theme-catalog')).toBeVisible();
    await snap(page, 'v4-catalogo-visual-dev');

    // V5 — recorrido clínico (login UI)
    await page.context().clearCookies();
    await loginViaUi(page);
    await snap(page, 'v5-comando-tras-login');
    await openEvolutionForm(page);
    await snap(page, 'v5-evolucion-formulario');
    await fillEvolutionDraft(page, 'Pasada visual M3 V5.');
    await page.getByTestId('epis2-form-sign').click();
    await expect(page.getByTestId('epis2-draft-approve')).toBeVisible();
    await snap(page, 'v5-borrador-aprobacion-humana');
    await page.getByTestId('epis2-draft-approve').click();
    await expect(page.getByTestId('epis2-draft-review-message')).toBeVisible();
    await snap(page, 'v5-nota-aprobada');
    await goToCommandCenter(page);
    await snap(page, 'v5-retorno-comando');

    // V6 — offline + reduced motion
    await openEvolutionForm(page);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await expect(page.getByTestId('epis2-offline-banner')).toBeVisible();
    await snap(page, 'v6-banner-offline');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await snap(page, 'v6-reduced-motion');
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
  });
});
