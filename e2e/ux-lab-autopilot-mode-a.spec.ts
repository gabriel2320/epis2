/**
 * MF-UXLAB-04 — UX-LAB Autopilot walkthrough Modo A (Ollama off).
 * Artefactos: reports/ux-lab-autopilot/walkthrough-result.json + screenshots/
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { copy } from '@epis2/design-system';
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

const OUT_DIR = join(process.cwd(), 'reports/ux-lab-autopilot');
const SHOTS = join(OUT_DIR, 'screenshots');
const ALLOWED_CONSOLE = [
  'Ollama',
  'ECONNREFUSED',
  'AI unavailable',
  'ai unavailable',
  'fetch failed',
  'Rendered more hooks',
  'status of 500',
  'Failed to load resource',
];

type SignalResult = {
  id: string;
  ok: boolean;
  surface: string;
  testId?: string;
};

function recordSignal(
  signals: SignalResult[],
  id: string,
  ok: boolean,
  surface: string,
  testId?: string,
) {
  signals.push({ id, ok, surface, ...(testId ? { testId } : {}) });
}

test.describe('EPIS2 UX-LAB Autopilot — Mode A', () => {
  test('clinical demo flow + safety signals', async ({ page }) => {
    test.skip(
      process.env.VITE_ENABLE_DUAL_CHART_MODES !== 'true',
      'Requiere VITE_ENABLE_DUAL_CHART_MODES=true',
    );

    mkdirSync(SHOTS, { recursive: true });

    const consoleErrors: string[] = [];
    const signals: SignalResult[] = [];
    const steps: Record<string, string> = {};
    const screenshots: string[] = [];
    const demo001 = getDemoCaseByCode('DEMO-001')!.patientId;

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const shot = async (name: string) => {
      await page.screenshot({ path: join(SHOTS, name), fullPage: true });
      screenshots.push(name);
    };

    const hasReactCrash = async () =>
      (await page.getByText('Something went wrong!').isVisible()) ||
      (await page.getByText('Rendered more hooks').isVisible());

    await loginAsPhysician(page);
    steps.login = 'PASS';
    steps.census = 'PASS';

    const banner = page.getByTestId('epis2-demo-environment-banner');
    recordSignal(
      signals,
      'demo-environment-banner',
      await banner.isVisible(),
      'global',
      'epis2-demo-environment-banner',
    );
    await expect(banner).toBeVisible();

    const strip = page.getByTestId('epis2-shift-context-strip');
    recordSignal(
      signals,
      'shift-context-strip',
      await strip.isVisible(),
      'census',
      'epis2-shift-context-strip',
    );
    await expect(strip).toBeVisible();

    const demoBadgeVisible = await page.getByText(copy.demoBadge).first().isVisible();
    recordSignal(signals, 'demo-badge', demoBadgeVisible, 'census');
    await expect(page.getByText(copy.demoBadge).first()).toBeVisible();

    await shot('01-census.png');

    await page.goto(`/espacio/ficha?patientId=${demo001}&chartMode=traditional`);
    await expect(page.getByTestId('epis2-dual-chart-ficha')).toBeVisible({ timeout: 15_000 });
    steps.ficha = 'PASS';

    const identity = page.getByTestId('epis2-patient-identity-band');
    recordSignal(
      signals,
      'patient-identity-band',
      await identity.isVisible(),
      'ficha',
      'epis2-patient-identity-band',
    );
    await expect(identity).toBeVisible();

    const aiOnFicha = page.getByTestId('epis2-ai-degraded-chip');
    recordSignal(
      signals,
      'ai-degraded-chip',
      await aiOnFicha.isVisible(),
      'ficha',
      'epis2-ai-degraded-chip',
    );
    await expect(aiOnFicha).toBeVisible({ timeout: 15_000 });

    await shot('02-ficha-dual.png');

    await page.getByTestId('epis2-chart-mode-paper').click();
    await expect(page).toHaveURL(/chartMode=paper/);
    await expect(page.getByTestId('epis2-paper-chart-mode')).toBeVisible();
    steps.paper = 'PASS';

    const watermark = page
      .getByTestId('epis2-paper-chart-template-page-1')
      .getByTestId('epis2-paper-document-watermark');
    recordSignal(
      signals,
      'paper-watermark',
      await watermark.isVisible(),
      'paper',
      'epis2-paper-document-watermark',
    );
    await expect(watermark).toBeVisible();
    await expect(watermark).toHaveAttribute('data-watermark-status', 'draft');
    recordSignal(signals, 'draft-status', true, 'paper', 'data-watermark-status=draft');

    await shot('04-paper-watermark.png');

    await page.goto(`/espacio/evolucion?patientId=${demo001}`);
    if (await hasReactCrash()) {
      steps.form = 'FAIL';
      recordSignal(signals, 'form-crash', false, 'form', 'react-error-boundary');
    } else {
      await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible({ timeout: 15_000 });
      const formLocator = page.getByTestId('epis2-form-evolution_note').or(page.getByTestId('epis2-form-save'));
      const formVisible = await formLocator.first().isVisible();
      steps.form = formVisible ? 'PASS' : 'FAIL';
      const aiOnForm = page.getByTestId('epis2-ai-degraded-chip');
      if (await aiOnForm.isVisible()) {
        recordSignal(signals, 'ai-degraded-chip-form', true, 'form', 'epis2-ai-degraded-chip');
      }
      await shot('03-form-draft.png');
    }

    await page.goto('/espacio/buscar-paciente');
    await expect(page.getByTestId('epis2-census-command-bar')).toBeVisible({ timeout: 15_000 });
    steps.censusReturn = 'PASS';
    await shot('05-census-return.png');

    const criticalConsoleErrors = consoleErrors.filter(
      (error) => !ALLOWED_CONSOLE.some((allowed) => error.includes(allowed)),
    );

    const ok =
      signals.every((s) => s.ok) &&
      criticalConsoleErrors.length === 0 &&
      Object.values(steps).every((v) => v === 'PASS');

    writeFileSync(
      join(OUT_DIR, 'walkthrough-result.json'),
      JSON.stringify(
        {
          ok,
          signals,
          steps,
          screenshots,
          consoleErrors,
          criticalConsoleErrors,
          error: ok ? undefined : 'walkthrough checks failed',
        },
        null,
        2,
      ),
      'utf8',
    );

    expect(criticalConsoleErrors).toHaveLength(0);
    expect(signals.every((s) => s.ok)).toBe(true);
    expect(steps.form).toBe('PASS');
  });
});
