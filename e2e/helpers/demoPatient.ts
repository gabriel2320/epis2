/**
 * Helpers E2E — pacientes demo sintéticos.
 */
import { copy } from '@epis2/design-system';
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { expect, type Locator, type Page } from '@playwright/test';

/** Barra transversal PROG-FICHA-FIRST — censo, formulario clínico o ficha dual (sin dock legacy). */
export function getTransversalCommandBar(page: Page): Locator {
  return page
    .getByTestId('epis2-census-command-bar')
    .or(page.getByTestId('epis2-espacio-chart-command-bar'))
    .or(page.getByTestId('epis2-chart-command-bar'))
    .or(page.getByTestId('epis2-paper-command-bar'));
}

/** Ficha dual ADR-002 — shell + modo tradicional (default post PROG-FICHA-FIRST). */
export async function expectDualChartFicha(page: Page) {
  await expect(page.getByTestId('epis2-dual-chart-ficha')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-traditional-ehr-mode')).toBeVisible();
}

export type ClassicChartTabId = 'summary' | 'evolutions' | 'orders' | 'exams' | 'documents' | 'more';

export async function openClassicChartTab(page: Page, tab: ClassicChartTabId) {
  const tabLocator = page.getByTestId(`classic-chart-tab-${tab}`);
  await expect(tabLocator).toBeVisible({ timeout: 15_000 });
  await tabLocator.click();
}

/** Resumen clínico cargado — fuerza tab Resumen (memoria operacional puede restaurar otra sección). */
export async function expectFichaSummaryReady(page: Page) {
  await expectDualChartFicha(page);
  await page
    .waitForResponse(
      (resp) => resp.url().includes('/api/user/operational-memory') && resp.ok(),
      { timeout: 15_000 },
    )
    .catch(() => undefined);
  await expect(async () => {
    await openClassicChartTab(page, 'summary');
    await expect(page.getByTestId('epis2-clinical-summary-grid')).toBeVisible({ timeout: 2_000 });
    await expect(
      page.locator('[data-testid^="epis2-clinical-summary-grid-"]').first(),
    ).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 15_000 });
}

/** Tab Evoluciones — timeline filtrable (dual-chart; sin split legacy de historial). */
export async function openFichaEvolutions(page: Page) {
  await openClassicChartTab(page, 'evolutions');
  await expect(page.getByTestId('epis2-clinical-filterable-timeline')).toBeVisible({
    timeout: 15_000,
  });
}

export async function openFichaExams(page: Page) {
  await openClassicChartTab(page, 'exams');
  await expect(page.getByTestId('epis2-traditional-section-labs')).toBeVisible({
    timeout: 15_000,
  });
}

export async function openFichaDocuments(page: Page) {
  await openClassicChartTab(page, 'documents');
  await expect(page.getByTestId('epis2-traditional-section-documents')).toBeVisible({
    timeout: 15_000,
  });
}

export async function loginAsPhysicianApiOnly(page: Page) {
  const login = await page.request.post('/api/auth/login', {
    data: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
  });
  if (!login.ok()) {
    throw new Error(`login médico demo falló (HTTP ${login.status()})`);
  }
  const state = await page.request.storageState();
  await page.context().addCookies(state.cookies);
}

export async function fillTransversalCommand(page: Page, query: string) {
  const bar = getTransversalCommandBar(page);
  await expect(bar).toBeVisible({ timeout: 15_000 });
  await bar.locator('input').first().fill(query);
  await bar.getByRole('button').first().click();
}

export async function loginAsPhysician(page: Page) {
  const login = await page.request.post('/api/auth/login', {
    data: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
  });
  if (!login.ok()) {
    throw new Error(`login médico demo falló (HTTP ${login.status()})`);
  }
  const state = await page.request.storageState();
  await page.context().addCookies(state.cookies);
  await page.goto('/espacio/buscar-paciente');
  await expect(page.getByTestId('epis2-census-command-bar')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();
}

export async function goToCommandCenter(page: Page) {
  await page.goto('/espacio/buscar-paciente');
  await expect(page.getByTestId('epis2-census-command-bar')).toBeVisible({ timeout: 15_000 });
}

/** Fija paciente demo por código DEMO-00x — navegación directa a ficha. */
export async function pinDemoCase(page: Page, demoCode: string) {
  const demo = getDemoCaseByCode(demoCode);
  if (!demo) {
    throw new Error(`demoCode desconocido: ${demoCode}`);
  }
  await page.goto(`/espacio/ficha?patientId=${demo.patientId}&chartMode=traditional`);
  await expectDualChartFicha(page);
}

/** Flujo UI Buscar → grid demo (alternativa cuando hace falta recorrer la búsqueda). */
export async function selectDemoPatientViaSearch(page: Page, demoCode: string) {
  await page.getByTestId('epis2-nav-buscar').click();
  await expect(page).toHaveURL(/\/espacio\/buscar-paciente/);
  await page.getByRole('button', { name: copy.forms.searchPatients }).click();
  await page.getByRole('button', { name: demoCode }).click();
  await expect(page).toHaveURL(/\/espacio\/ficha/);
  await expectDualChartFicha(page);
}

export async function openAmbulatoryFromCommand(page: Page) {
  await goToCommandCenter(page);
  await fillTransversalCommand(page, 'consulta ambulatoria de control');
  await expect(page).toHaveURL(/\/espacio\/ambulatorio/);
  await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible({ timeout: 15_000 });
}

export async function clickModeSwitcher(page: Page, mode: 'command' | 'classic' | 'dashboard') {
  await page.getByTestId(`epis2-mode-switcher-${mode}`).click();
}

/** MF-CM-02 / MF-DI-10 — input real dentro del wrapper MUI de la paleta. */
export async function fillCommandPaletteQuery(page: Page, query: string) {
  await page.getByTestId('epis2-command-palette-query').locator('input').fill(query);
}

/** MF-DI-09 — borrador receta válido para guardar (todos los required del blueprint). */
export async function fillMinimalPrescriptionDraft(page: Page) {
  await expect(page.getByTestId('epis2-active-patient')).toBeVisible({ timeout: 15_000 });
  const medication = page.getByTestId('epis2-medication-catalog-autocomplete-input');
  await expect(medication).toBeVisible({ timeout: 15_000 });
  await expect(async () => {
    await medication.fill('Metformina 850 mg');
    await expect(medication).toHaveValue('Metformina 850 mg');
  }).toPass({ timeout: 15_000 });
  await page.getByTestId('epis2-field-dose').locator('input').fill('1 comprimido');
  await page.getByTestId('epis2-field-quantity').locator('input').fill('30 comprimidos');
  await page.getByTestId('epis2-field-frequency').locator('input').fill('Cada 12 horas');
  await page.getByTestId('epis2-field-duration').locator('input').fill('30 días');
  await page
    .getByRole('textbox', { name: /indicaciones al paciente/i })
    .fill('Tomar con las comidas (demo E2E)');
}
