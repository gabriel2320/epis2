/**
 * PROG-PAPER-PLANNER — agenda día/semana/mes + print (MF-PAPER-PLANNER-02…03).
 * Print route: /espacio/ficha/agenda/imprimir
 */
import { test, expect } from '@playwright/test';
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { loginAsPhysician } from './helpers/demoPatient.js';

const demoPatientId = getDemoCaseByCode('DEMO-005')!.patientId;

test.describe('Paper planner journey', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      process.env.VITE_ENABLE_DUAL_CHART_MODES !== 'true',
      'Requiere VITE_ENABLE_DUAL_CHART_MODES=true',
    );
    await loginAsPhysician(page);
  });

  test('j) abre agenda día desde ficha papel', async ({ page }) => {
    await page.goto(
      `/espacio/ficha?patientId=${demoPatientId}&chartMode=paper&paperSurface=planner&plannerView=day`,
    );
    await expect(page.getByTestId('epis2-paper-planner-day')).toBeVisible({ timeout: 15_000 });
  });

  test('k) alterna vistas semana y mes', async ({ page }) => {
    await page.goto(
      `/espacio/ficha?patientId=${demoPatientId}&chartMode=paper&paperSurface=planner&plannerView=day`,
    );
    await page.getByTestId('epis2-paper-planner-view-week').click();
    await expect(page.getByTestId('epis2-paper-planner-week')).toBeVisible();
    await page.getByTestId('epis2-paper-planner-view-month').click();
    await expect(page.getByTestId('epis2-paper-planner-month')).toBeVisible();
    await expect(page.getByTestId('epis2-paper-planner-month-markers-2026-06-11')).toBeVisible();
  });

  test('l) imprime agenda semanal', async ({ page }) => {
    await page.goto(
      `/espacio/ficha?patientId=${demoPatientId}&chartMode=paper&paperSurface=planner&plannerView=week`,
    );
    await expect(page.getByTestId('epis2-paper-planner-week')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('epis2-paper-print').click();
    await expect(page).toHaveURL(/\/espacio\/ficha\/agenda\/imprimir/);
    await expect(page.getByTestId('epis2-paper-planner-print-page')).toBeVisible();
    await expect(page.getByTestId('epis2-paper-planner-week')).toBeVisible();
  });
});
