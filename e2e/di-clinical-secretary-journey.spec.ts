/**
 * MF-DI-10 — Golden journey «secretario clínico» sin Ollama (subset E2E).
 * @see docs/product/EPIS2_PROG_DETERMINISTIC_INTELLIGENCE.md §9
 */
import { copy } from '@epis2/design-system';
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { test, expect } from '@playwright/test';
import { fillCommandPaletteQuery, loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

const dm2Patient = getDemoCaseByCode('DEMO-002')!;

test.describe('MF-DI-10 — secretario clínico sin Ollama', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      process.env.VITE_ENABLE_DUAL_CHART_MODES !== 'true',
      'Requiere VITE_ENABLE_DUAL_CHART_MODES=true',
    );
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-002');
  });

  test('journey control crónico DM2 — capas DI, comando, microjourney, lab', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/espacio/ficha?patientId=${dm2Patient.patientId}&chartMode=traditional`);
    await expect(page.getByTestId('epis2-dual-chart-ficha')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-clinical-context-dense-strip')).toBeVisible();
    await expect(page.getByTestId('epis2-clinical-probable-actions')).toBeVisible();
    await expect(page.getByTestId('epis2-clinical-silent-suggestions')).toBeVisible();

    await page.keyboard.press('Control+k');
    await fillCommandPaletteQuery(page, 'evol');
    await page.getByTestId('epis2-command-palette-item-create_evolution_draft').click();
    await expect(page).toHaveURL(/\/espacio\/evolucion/);
    await expect(page.getByTestId('epis2-form-evolution_note')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-command-prefill-badge')).toBeVisible();

    await page.getByRole('button', { name: copy.forms.save }).click();
    await expect(page.getByTestId('epis2-post-save-microjourneys')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-microjourney-linked-rx')).toBeVisible();

    await page.goto(`/espacio/ficha?patientId=${dm2Patient.patientId}&chartMode=traditional`);
    await expect(page.getByTestId('epis2-dual-chart-ficha')).toBeVisible({ timeout: 15_000 });
    await page.keyboard.press('Control+k');
    await fillCommandPaletteQuery(page, 'lab');
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByTestId('epis2-command-palette-item-request_laboratory').click();
    await expect(page.getByTestId('epis2-command-confirmation-dialog')).toBeVisible({
      timeout: 15_000,
    });
    await page.getByTestId('epis2-command-confirm').click();
    await expect(page).toHaveURL(/\/espacio\/laboratorio/);
    await expect(page.getByTestId('epis2-form-lab_request')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-command-prefill-badge')).toBeVisible();

    await page.goto(`/espacio/ficha?patientId=${dm2Patient.patientId}&chartMode=traditional`);
    await page.getByTestId('epis2-traditional-ehr-nav-navEvolution').click();
    await expect(page.getByTestId('epis2-clinical-filterable-timeline')).toBeVisible();
  });
});
