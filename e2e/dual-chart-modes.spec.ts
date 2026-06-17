/**
 * ADR-002 — E2E dual chart modes (opt-in CI: VITE_ENABLE_DUAL_CHART_MODES=true).
 */
import { test, expect } from '@playwright/test';
import {
  fillCommandPaletteQuery,
  fillMinimalPrescriptionDraft,
  getCommandPaletteQueryInput,
  loginAsPhysician,
  openClassicChartTab,
  pinDemoCase,
} from './helpers/demoPatient.js';
import type { Page } from '@playwright/test';

async function openDemoFicha(page: Page, demoCode: string) {
  await pinDemoCase(page, demoCode);
  await expect(page.getByTestId('epis2-dual-chart-ficha')).toBeVisible({ timeout: 15_000 });
}

async function expandDualChartContextPanel(page: Page) {
  const expand = page.getByTestId('epis2-clinical-right-context-panel-expand');
  if (await expand.isVisible().catch(() => false)) {
    await expand.click();
  }
  await expect(page.getByTestId('epis2-clinical-right-context-panel')).toBeVisible({
    timeout: 15_000,
  });
}

async function openPaperFromDualFicha(page: Page) {
  await page.getByTestId('epis2-chart-layout-paper').click();
  await expect(page).toHaveURL(/chartMode=paper/, { timeout: 15_000 });
  await expect(page.getByTestId('epis2-paper-chart-mode')).toBeVisible({ timeout: 15_000 });
}

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
    await expect(page.getByTestId('classic-chart-tabs')).toBeVisible();
  });

  test('b) alterna a ficha papel', async ({ page }) => {
    await page.getByTestId('epis2-chart-mode-paper').click();
    await expect(page.getByTestId('epis2-paper-chart-mode')).toBeVisible();
    await expect(page.getByTestId('epis2-paper-chart-template')).toBeVisible();
    await expect(
      page
        .getByTestId('epis2-paper-chart-template-page-1')
        .getByTestId('epis2-paper-document-watermark'),
    ).toHaveAttribute('data-watermark-status', 'draft');
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

test.describe('Dual chart /espacio/ficha (MF-DUAL-CHART-03)', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      process.env.VITE_ENABLE_DUAL_CHART_MODES !== 'true',
      'Requiere VITE_ENABLE_DUAL_CHART_MODES=true',
    );
    await loginAsPhysician(page);
  });

  test('g) abre ficha tradicional en /espacio/ficha', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await expect(page).toHaveURL(/chartMode=traditional/, { timeout: 15_000 });
    await expect(page.getByTestId('epis2-traditional-ehr-mode')).toBeVisible();
  });

  test('g2b) trust ladder — demo + borrador + IA degradada (MF-UXLAB-02)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await expect(page.getByTestId('epis2-patient-identity-demo-badge')).toBeVisible();
    await expect(page.getByTestId('epis2-draft-status-draft')).toBeVisible();
    await expect(async () => {
      await expect(page.getByTestId('epis2-ai-degraded-chip')).toBeVisible();
    }).toPass({ timeout: 15_000 });
  });

  test('g2) contexto denso visible en ficha (MF-DI-01)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await expect(page.getByTestId('epis2-clinical-context-dense-strip')).toBeVisible();
    await expect(page.getByTestId('epis2-clinical-context-dense-strip-care-setting')).toBeVisible();
  });

  test('g3) acciones probables en resumen ficha (MF-DI-05)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await expect(page.getByTestId('epis2-clinical-probable-actions')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator('[data-testid^="epis2-suggestion-card-"]').first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('g4) chips silenciosos en panel contexto (MF-DI-06)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openDemoFicha(page, 'DEMO-001');
    await expandDualChartContextPanel(page);
    await expect(page.getByTestId('epis2-clinical-silent-suggestions')).toBeVisible();
  });

  test('g5) timeline filtrable en evoluciones (MF-DI-08)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await openClassicChartTab(page, 'evolutions');
    await expect(page.getByTestId('epis2-clinical-filterable-timeline')).toBeVisible();
    await expect(
      page.getByTestId('epis2-clinical-filterable-timeline-filter-evolutions'),
    ).toBeVisible();
    await page.getByTestId('epis2-clinical-filterable-timeline-filter-evolutions').click();
    await expect(
      page
        .getByTestId('epis2-clinical-filterable-timeline-period-last3Months')
        .or(page.getByTestId('epis2-clinical-filterable-timeline-period-today'))
        .or(page.getByTestId('epis2-clinical-filterable-timeline-empty-filter'))
        .first(),
    ).toBeVisible();
  });

  test('g6) microjourneys post-receta (MF-DI-09)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await openClassicChartTab(page, 'more');
    await page.getByTestId('epis2-chart-layout-prescription').click();
    await fillMinimalPrescriptionDraft(page);
    const saveButton = page.getByTestId('epis2-form-save');
    await expect(saveButton).toBeEnabled();
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes('/drafts') &&
          (response.request().method() === 'POST' || response.request().method() === 'PUT') &&
          response.ok(),
        { timeout: 20_000 },
      ),
      saveButton.click(),
    ]);
    await expect(page.getByTestId('epis2-post-save-microjourneys')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-microjourney-print-rx')).toBeVisible();
  });

  test('h) patient-view muestra CDS card al abrir ficha DEMO-005', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    const patientViewPanel = page.getByTestId('epis2-cds-patient-view');
    await expect(patientViewPanel).toBeVisible({ timeout: 15_000 });
    await expect(
      page.locator('[data-testid^="epis2-cds-patient-view-card-"]').first(),
    ).toBeVisible();
  });

  test('h-alt) alterna a papel desde /espacio/ficha', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await openPaperFromDualFicha(page);
    await expect(
      page
        .getByTestId('epis2-paper-chart-template-page-1')
        .getByTestId('epis2-paper-document-watermark'),
    ).toBeVisible();
  });

  test('i) paleta @epis2/clinical-productivity en ficha dual', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await page.keyboard.press('Control+k');
    await expect(page.getByTestId('epis2-clinical-command-palette').first()).toBeVisible();
    await expect(getCommandPaletteQueryInput(page)).toBeVisible();
  });

  test('k) Ctrl+K en ficha papel (MF-CM-02)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await openPaperFromDualFicha(page);
    await page.keyboard.press('Control+k');
    await expect(page.getByTestId('epis2-clinical-command-palette')).toBeVisible();
    await expect(page.getByTestId('epis2-command-palette-query')).toBeVisible();
  });

  test('l) paleta fuzzy filtra evolución (MF-CM-02)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await page.keyboard.press('Control+k');
    await fillCommandPaletteQuery(page, 'evol');
    await expect(
      page.getByTestId('epis2-command-palette-item-create_evolution_draft'),
    ).toBeVisible();
  });

  test('j) navega sección alergias con contenido (MF-TE-02)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await expect(page.getByTestId('epis2-patient-allergy-chip').first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('m) switch modo preserva paciente (MF-NORM-11)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await openPaperFromDualFicha(page);
    await page.getByTestId('epis2-clinical-nav-ficha').click();
    await expect(page).toHaveURL(/chartMode=traditional/, { timeout: 15_000 });
    await expect(page.getByTestId('epis2-traditional-ehr-mode')).toBeVisible();
  });

  test('n) oculta nav demo vacías (MF-NORM-11)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-005');
    await openClassicChartTab(page, 'evolutions');
    await expect(page.getByTestId('classic-chart-subnav-navAntecedents')).toHaveCount(0);
  });

  test('o) panel IA contextual en ficha tradicional (MF-CM-08 / UX-G02 E)', async ({ page }) => {
    await openDemoFicha(page, 'DEMO-001');
    await expandDualChartContextPanel(page);
    await expect(page.getByTestId('epis2-traditional-ehr-mode')).toBeVisible();
    await expect(page.getByTestId('epis2-context-ai-panel')).toBeVisible();
    await expect(page.getByTestId('epis2-context-suggested-actions')).toBeVisible();
  });
});
