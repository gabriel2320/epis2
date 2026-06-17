/**
 * CICA Clean Room — borrador de evolución SOAP (/app/pacientes/:id/evoluciones/nueva).
 * @see docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md
 */
import { copy } from '@epis2/design-system';
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { test, expect } from '@playwright/test';
import {
  fillMinimalEvolutionDraft,
  loginAsPhysicianCica,
  openCicaChartTab,
  openCicaNewEvolution,
  pinCicaDemoCase,
} from './helpers/demoPatient.js';

test.describe('CICA Clean Room — borrador evolución', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPhysicianCica(page);
  });

  test('resumen → evoluciones → nueva evolución → guardar borrador → lista', async ({ page }) => {
    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');

    await pinCicaDemoCase(page, 'DEMO-001');
    await expect(page).toHaveURL(new RegExp(`/app/pacientes/${demo.patientId}/resumen`));
    await expect(page.getByTestId('cica-patient-summary-screen')).toBeVisible({ timeout: 15_000 });

    await openCicaNewEvolution(page);

    await fillMinimalEvolutionDraft(page, 'Paciente refiere mejoría (demo CICA E2E).');

    await page.getByTestId('epis2-form-save').click();
    await expect(page.getByTestId('epis2-form-status')).toContainText(copy.forms.draftSaved, {
      timeout: 15_000,
    });

    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`/app/pacientes/${demo.patientId}/evoluciones`), {
      timeout: 15_000,
    });
    await expect(page.getByTestId('cica-patient-evolutions-screen')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('cica-evolutions-list')).toBeVisible();
    await expect(page.getByTestId('cica-chart-tab-evoluciones')).toBeVisible();
  });

  test('ruta directa /evoluciones/nueva carga formulario CICA', async ({ page }) => {
    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');

    await pinCicaDemoCase(page, 'DEMO-001');
    await page.goto(`/app/pacientes/${demo.patientId}/evoluciones/nueva`);

    await expect(page).toHaveURL(new RegExp(`/app/pacientes/${demo.patientId}/evoluciones/nueva`), {
      timeout: 15_000,
    });
    await expect(page.getByTestId('cica-screen-new-evolution')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-cica-evolution-form')).toBeVisible();
    await expect(page.getByTestId('epis2-field-subjective-rich-input')).toBeVisible();
    await expect(page.getByTestId('epis2-form-save')).toHaveText(copy.forms.saveDraft);

    await page.getByTestId('cica-evolution-back-to-chart').click();
    await expect(page).toHaveURL(new RegExp(`/app/pacientes/${demo.patientId}/resumen`), {
      timeout: 15_000,
    });
    await openCicaChartTab(page, 'evoluciones');
    await expect(page.getByTestId('cica-evolutions-list')).toBeVisible();
  });
});
