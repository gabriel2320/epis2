/**
 * UX-G02 — Validación E2E del flujo command-first (CE-0 → CE-5).
 * @see reports/epis2-ux-g02-command-first-checklist-2026-06-07.md
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import {
  fillTransversalCommand,
  getTransversalCommandBar,
  loginAsPhysician,
  pinDemoCase,
} from './helpers/demoPatient.js';

const DEMO_001_PATIENT_ID = 'a0000001-0000-4000-8000-000000000001';

test.describe('UX-G02 — command-first con paciente fijado', () => {
  test('Parte A: TAC → confirmación → badge → prefill → URL limpia', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.goto('/espacio/buscar-paciente');

    await fillTransversalCommand(page, 'pedir TAC de tórax');

    // 5: confirmación CE-2
    const dialog = page.getByTestId('epis2-command-confirmation-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(copy.commandCenter.needsConfirmationTitle)).toBeVisible();

    await page.getByTestId('epis2-command-confirm').click();

    // 6–7: formulario + badge CE-5
    await expect(page).toHaveURL(/\/espacio\/imagenologia/);
    await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();
    await expect(page.getByTestId('epis2-form-imaging_request')).toBeVisible();
    await expect(page.getByTestId('epis2-command-prefill-badge')).toHaveText(
      copy.forms.commandPrefillBadge,
    );

    // 8: prefill (MUI Select expone el valor como nombre del combobox, no getByLabel)
    await expect(page.getByRole('combobox', { name: /^TC$/ })).toBeVisible();
    const studyField = page.getByRole('textbox', { name: /estudio solicitado/i });
    await expect(studyField).not.toHaveValue('');

    // 9: URL limpia (replace tras montar)
    await expect
      .poll(async () => {
        const url = new URL(page.url());
        return (
          url.pathname.includes('/espacio/imagenologia') &&
          url.searchParams.has('patientId') &&
          !url.searchParams.has('studyHint') &&
          !url.searchParams.has('bodySiteHint') &&
          !url.searchParams.has('clinicalReasonHint')
        );
      })
      .toBe(true);

    // 10: guardar tras revisión (campos mínimos)
    await page
      .getByRole('textbox', { name: /indicación clínica/i })
      .fill('Evaluación torácica (UX-G02 demo)');
    await page.getByRole('button', { name: copy.forms.save }).click();
    await expect(page.getByTestId('epis2-form-status')).toBeVisible();
  });

  test('Parte B: ficha tradicional → evolución con paciente activo', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');

    // 11: ficha tradicional (dual chart default) o legacy UX-B.2
    const legacyWorkspace = page.getByTestId('epis2-patient-workspace');
    await expect(
      page.getByTestId('epis2-dual-chart-ficha').or(legacyWorkspace),
    ).toBeVisible({ timeout: 15_000 });
    if (await legacyWorkspace.isVisible()) {
      await expect(page.getByTestId('epis2-floating-command-dock')).toBeVisible();
      await expect(page.getByTestId('epis2-ficha-widget-panel')).toHaveCount(0);
      await expect(page.getByTestId('epis2-ficha-history')).toBeVisible();
    } else {
      await expect(page.getByTestId('epis2-traditional-ehr-mode')).toBeVisible();
    }

    // 12–13: evolución desde barra transversal de ficha
    const fichaBar = getTransversalCommandBar(page);
    await fichaBar.locator('input').first().fill('hacer evolución');
    await fichaBar.getByRole('button').first().click();

    await expect(page).toHaveURL(
      new RegExp(`/espacio/evolucion.*patientId=${DEMO_001_PATIENT_ID}`),
    );
    await expect(page.getByTestId('epis2-form-evolution_note')).toBeVisible();
    await expect(page.getByTestId('epis2-active-patient')).toBeVisible();

    // CE-4: prefill contextual en campos vacíos
    await expect(page.getByRole('textbox', { name: /objetivo/i })).not.toHaveValue('');
    await expect(page.getByRole('textbox', { name: /análisis/i })).not.toHaveValue('');
  });

  test('Parte C1: cancelar confirmación no navega', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.goto('/espacio/buscar-paciente');

    await fillTransversalCommand(page, 'pedir TAC de tórax');

    await expect(page.getByTestId('epis2-command-confirmation-dialog')).toBeVisible();
    await page.getByRole('button', { name: copy.commandCenter.needsConfirmationCancel }).click();

    await expect(page).toHaveURL(/\/espacio\/buscar-paciente/);
    await expect(page.getByTestId('epis2-form-imaging_request')).not.toBeAttached();
  });

  test('Parte D: Ctrl+K abre paleta en ficha en <1s (MF-CM-08)', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto(`/espacio/ficha?patientId=${DEMO_001_PATIENT_ID}&chartMode=traditional`);
    await expect(
      page.getByTestId('epis2-dual-chart-ficha').or(page.getByTestId('epis2-patient-workspace')),
    ).toBeVisible({ timeout: 15_000 });

    const start = Date.now();
    await page.keyboard.press('Control+k');
    await expect(page.getByTestId('epis2-clinical-command-palette')).toBeVisible();
    await expect(page.getByTestId('epis2-command-palette-query')).toBeVisible();
    expect(Date.now() - start).toBeLessThan(1000);
  });

  test('Parte E: panel IA contextual en ficha tradicional (MF-CM-08)', async ({ page }) => {
    test.skip(
      process.env.VITE_ENABLE_DUAL_CHART_MODES !== 'true',
      'Requiere dual ficha — cubierto en e2e/dual-chart-modes.spec.ts',
    );
    await loginAsPhysician(page);
    await page.goto(`/espacio/ficha?patientId=${DEMO_001_PATIENT_ID}&chartMode=traditional`);
    await expect(page.getByTestId('epis2-dual-chart-ficha')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-traditional-ehr-mode')).toBeVisible();
    await expect(page.getByTestId('epis2-context-ai-panel')).toBeVisible();
    await expect(page.getByTestId('epis2-context-suggested-actions')).toBeVisible();
  });
});
