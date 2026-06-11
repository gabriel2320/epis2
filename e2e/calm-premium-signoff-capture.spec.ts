/**
 * C-2.4 — Captura 6 superficies Calm Premium (scaffold signoff).
 * Requiere VITE_ENABLE_DUAL_CHART_MODES=true para traditional/paper/censo chart.
 */
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { loginAsPhysician } from './helpers/demoPatient.js';

const evidenceDir =
  process.env.CALM_PREMIUM_EVIDENCE_DIR ??
  join(process.cwd(), 'reports', 'm3-visual-evidence', 'calm-premium', 'latest');

const demoPatientId = getDemoCaseByCode('DEMO-005')!.patientId;

mkdirSync(evidenceDir, { recursive: true });

async function snap(page: Page, name: string) {
  await page.screenshot({
    path: join(evidenceDir, `${name}.png`),
    fullPage: true,
  });
}

async function setCalmPreferences(page: Page, mode: 'light' | 'dark') {
  await page.addInitScript(
    (prefs) => {
      window.localStorage.setItem('epis2-theme-preferences-v2', JSON.stringify(prefs));
    },
    {
      mode,
      accent: 'clinicalCalm',
      density: 'comfortable',
      contrast: 'standard',
      motion: 'standard',
      clinicalSplitScreen: 'focus',
      clinicalWorkspace: 'command',
    },
  );
}

test.describe('Calm Premium signoff capture C-2.4', () => {
  test.describe.configure({ mode: 'serial' });

  test('captura 6 superficies', async ({ page }) => {
    const dualOn = process.env.VITE_ENABLE_DUAL_CHART_MODES === 'true';

    await setCalmPreferences(page, 'light');
    await loginAsPhysician(page);

    await page.goto('/comando');
    await expect(page.getByTestId('epis2-power-bar')).toBeVisible({ timeout: 15_000 });
    await snap(page, 's1-comando-calm-light');

    if (dualOn) {
      await page.goto('/espacio/buscar-paciente');
      await expect(page.getByTestId('epis2-census-command-bar')).toBeVisible({ timeout: 15_000 });
      await snap(page, 's2-censo-calm-light');

      await page.goto(`/espacio/ficha?patientId=${demoPatientId}&chartMode=traditional`);
      await expect(page.getByTestId('epis2-traditional-ehr-mode')).toBeVisible({ timeout: 15_000 });
      await snap(page, 's3-traditional-calm-light');

      await page.getByTestId('epis2-chart-mode-paper').click();
      await expect(page.getByTestId('epis2-paper-chart-mode')).toBeVisible();
      await snap(page, 's4-paper-calm-light');

      await setCalmPreferences(page, 'dark');
      await page.reload();
      await expect(page.getByTestId('epis2-paper-chart-mode')).toBeVisible({ timeout: 15_000 });
      await snap(page, 's5-dark-paper-calm');

      await page.goto(
        `/espacio/ficha/imprimir?patientId=${demoPatientId}&chartMode=paper&printFormat=letter`,
      );
      await page.waitForTimeout(800);
      await snap(page, 's6-print-letter-calm');
    } else {
      test.info().annotations.push({
        type: 'skip-dual',
        description: 'Superficies 2–6 omitidas — VITE_ENABLE_DUAL_CHART_MODES≠true',
      });
    }
  });
});
