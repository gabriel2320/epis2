/**
 * MF-NORM-401 — Smoke de accesibilidad con axe-core (norma R-12 / §14).
 * Gate: 0 violaciones `serious`/`critical` en Centro de Comando, ficha y formulario clínico.
 * Escrito role-first (piloto MF-NORM-402 — docs/quality/E2E_SELECTOR_POLICY.md).
 *
 * En CI dentro de `test:e2e` desde MF-NORM-401b (rail con aria-label, CTAs con
 * primary.dark sobre surfaceContainer, label asociado en date picker, ul>li en scrollspy).
 */
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Page } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

const DEMO001_PATIENT_ID = 'a0000001-0000-4000-8000-000000000001';

async function expectNoSevereViolations(page: Page, surface: string) {
  const results = await new AxeBuilder({ page }).analyze();
  const severe = results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
    }));
  expect(severe, `Violaciones axe serious/critical en ${surface}`).toEqual([]);
}

test.describe('A11y smoke — axe-core', () => {
  test('Centro de Comando sin violaciones serias', async ({ page }) => {
    await loginAsPhysician(page);
    await expectNoSevereViolations(page, 'Centro de Comando (/espacio/buscar-paciente)');
  });

  test('Ficha del paciente sin violaciones serias', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expectNoSevereViolations(page, 'Ficha (/espacio/ficha)');
  });

  test('Formulario clínico (evolución) sin violaciones serias', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.goto(`/espacio/evolucion?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByRole('heading', { name: 'Evolución médica' })).toBeVisible({
      timeout: 15_000,
    });
    await expectNoSevereViolations(page, 'Formulario evolución (/espacio/evolucion)');
  });
});
