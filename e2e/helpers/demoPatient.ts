/**
 * Helpers E2E — pacientes demo sintéticos.
 */
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { expect, type Locator, type Page } from '@playwright/test';

export { getDemoCaseByCode };

/** Barra transversal PROG-FICHA-FIRST — ficha dual o búsqueda limpia (sin NL duplicado en censo). */
export function getTransversalCommandBar(page: Page): Locator {
  return page
    .getByTestId('epis2-espacio-chart-command-bar')
    .or(page.getByTestId('epis2-chart-command-bar'))
    .or(page.getByTestId('epis2-paper-command-bar'));
}

export function getPatientSearchInput(page: Page): Locator {
  return page.getByTestId('epis2-patient-search-hero-input');
}

/** Ficha dual ADR-002 — shell + modo tradicional (default post PROG-FICHA-FIRST). */
export async function expectDualChartFicha(page: Page) {
  await expect(page.getByTestId('epis2-dual-chart-ficha')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-traditional-ehr-mode')).toBeVisible();
}

export type ClassicChartTabId =
  | 'summary'
  | 'evolutions'
  | 'orders'
  | 'exams'
  | 'documents'
  | 'more';

export async function openClassicChartTab(page: Page, tab: ClassicChartTabId) {
  const tabLocator = page.getByTestId(`classic-chart-tab-${tab}`);
  await expect(tabLocator).toBeVisible({ timeout: 15_000 });
  await tabLocator.click();
}

/** Resumen clínico cargado — fuerza tab Resumen (memoria operacional puede restaurar otra sección). */
export async function expectFichaSummaryReady(page: Page) {
  await expectDualChartFicha(page);
  await page
    .waitForResponse((resp) => resp.url().includes('/api/user/operational-memory') && resp.ok(), {
      timeout: 15_000,
    })
    .catch(() => undefined);
  await expect(async () => {
    await openClassicChartTab(page, 'summary');
    await expect(page.getByTestId('epis2-classic-summary-panel')).toBeVisible({ timeout: 2_000 });
    await expect(page.getByTestId('epis2-classic-summary-panel-diagnoses')).toBeVisible({
      timeout: 2_000,
    });
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
  await expect(page.getByTestId('epis2-patient-search-screen')).toBeVisible({ timeout: 15_000 });
  await expect(getPatientSearchInput(page)).toBeVisible();
  await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();
}

export async function goToCommandCenter(page: Page) {
  await page.goto('/espacio/buscar-paciente');
  await expect(page.getByTestId('epis2-patient-search-screen')).toBeVisible({ timeout: 15_000 });
  await expect(getPatientSearchInput(page)).toBeVisible();
}

/** Fija paciente demo por código DEMO-00x — vía búsqueda clínica (CICA censo). */
export async function pinDemoCase(page: Page, demoCode: string) {
  await selectDemoPatientViaSearch(page, demoCode);
}

/** Flujo UI Buscar → lista demo (PR-AEST-PATIENT-SEARCH-01). */
export async function selectDemoPatientViaSearch(page: Page, demoCode: string) {
  const demo = getDemoCaseByCode(demoCode);
  if (!demo) {
    throw new Error(`demoCode desconocido: ${demoCode}`);
  }
  await page.goto('/espacio/buscar-paciente');
  await expect(getPatientSearchInput(page)).toBeVisible({ timeout: 15_000 });
  await getPatientSearchInput(page).fill(demoCode);
  await page.getByTestId('epis2-patient-search-submit').click();
  await page.getByTestId(`epis2-patient-search-open-${demo.patientId}`).click();
  await expect(page).toHaveURL(/\/espacio\/ficha/);
  await expectDualChartFicha(page);
}

export async function openAmbulatoryFromCommand(page: Page) {
  await pinDemoCase(page, 'DEMO-001');
  await fillTransversalCommand(page, 'consulta ambulatoria de control');
  await expect(page).toHaveURL(/\/espacio\/ambulatorio/);
  await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible({ timeout: 15_000 });
}

export async function clickModeSwitcher(page: Page, mode: 'command' | 'classic' | 'dashboard') {
  await page.getByTestId(`epis2-mode-switcher-${mode}`).click();
}

/** MF-CM-02 / MF-DI-10 — input real dentro del wrapper MUI de la paleta. */
export function getCommandPaletteQueryInput(page: Page): Locator {
  return page
    .getByTestId('epis2-clinical-command-palette')
    .first()
    .getByTestId('epis2-command-palette-query')
    .locator('input');
}

export async function fillCommandPaletteQuery(page: Page, query: string) {
  await getCommandPaletteQueryInput(page).fill(query);
}

/** MF-DI-09 — borrador receta válido para guardar (todos los required del blueprint). */
/** CICA Clean Room — input búsqueda /app/buscar. */
export function getCicaPatientSearchInput(page: Page): Locator {
  return page.getByTestId('cica-patient-search-input');
}

export type CicaChartTabId =
  | 'resumen'
  | 'evoluciones'
  | 'indicaciones'
  | 'examenes'
  | 'documentos'
  | 'papel';

export async function loginAsPhysicianCica(page: Page) {
  await loginAsPhysicianApiOnly(page);
  await page.goto('/app/buscar');
  await expect(page.getByTestId('cica-patient-search-hero')).toBeVisible({ timeout: 15_000 });
  await expect(getCicaPatientSearchInput(page)).toBeVisible();
}

/** Flujo UI /app/buscar → ficha resumen CICA Clean Room. */
export async function selectCicaDemoPatientViaSearch(page: Page, demoCode: string) {
  const demo = getDemoCaseByCode(demoCode);
  if (!demo) {
    throw new Error(`demoCode desconocido: ${demoCode}`);
  }
  await page.goto('/app/buscar');
  await expect(getCicaPatientSearchInput(page)).toBeVisible({ timeout: 15_000 });
  await getCicaPatientSearchInput(page).fill(demoCode);
  await page.getByTestId('cica-patient-search-submit').click();
  await page.getByTestId(`epis2-patient-search-open-${demo.patientId}`).click();
  await expect(page).toHaveURL(new RegExp(`/app/pacientes/${demo.patientId}/resumen`), {
    timeout: 15_000,
  });
  await expectCicaPatientSummaryReady(page);
}

/** Fija paciente demo por código DEMO-00x — vía búsqueda CICA (/app/buscar). */
export async function pinCicaDemoCase(page: Page, demoCode: string) {
  await selectCicaDemoPatientViaSearch(page, demoCode);
}

export async function openCicaChartTab(page: Page, tab: CicaChartTabId) {
  const tabLocator = page.getByTestId(`cica-chart-tab-${tab}`);
  await expect(tabLocator).toBeVisible({ timeout: 15_000 });
  await tabLocator.click();
}

/** Resumen clínico CICA — panel + 5 bloques canónicos. */
export async function expectCicaPatientSummaryReady(page: Page) {
  await expect(page.getByTestId('cica-patient-summary-screen')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('cica-chart-tabs')).toBeVisible();
  await expect(page.getByTestId('cica-classic-summary-panel')).toBeVisible();
  await expect(page.getByTestId('cica-classic-summary-panel-diagnoses')).toBeVisible({
    timeout: 15_000,
  });
}

export async function fillMinimalPrescriptionDraft(page: Page) {
  await expect(page.getByTestId('epis2-form-prescription')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-form-field-cell-medication')).toBeVisible({
    timeout: 15_000,
  });
  const medicationCatalog = page.getByTestId('epis2-medication-catalog-autocomplete-input');
  const medication =
    (await medicationCatalog.count()) > 0
      ? medicationCatalog
      : page.getByTestId('epis2-form-field-cell-medication').locator('input').first();
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

/** CICA — medicamento mínimo; el resto puede venir de prefill clínico del paciente. */
export async function fillMinimalPrescriptionMedicationField(
  page: Page,
  medicationLabel = 'Metformina 850 mg',
) {
  const medication = page.getByTestId('epis2-medication-catalog-autocomplete-input');
  await expect(medication).toBeVisible({ timeout: 15_000 });
  await expect(async () => {
    await medication.fill(medicationLabel);
    await expect(medication).toHaveValue(medicationLabel);
  }).toPass({ timeout: 15_000 });
}

/** CICA — certificado médico: tipo obligatorio + campos requeridos si el prefill no los cubrió. */
export async function fillMinimalDocumentDraft(page: Page) {
  await expect(page.getByTestId('cica-screen-new-document')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-cica-certificate-form')).toBeVisible();

  const certificateType = page.getByRole('combobox', { name: /tipo de certificado/i });
  await expect(certificateType).toBeVisible({ timeout: 15_000 });
  await certificateType.click();
  await page.getByRole('option', { name: /Certificado de reposo/i }).click();

  const diagnosis = page.getByTestId('epis2-field-diagnosisSummary').locator('textarea');
  if ((await diagnosis.inputValue()).trim() === '') {
    await diagnosis.fill('Control ambulatorio demo CICA E2E.');
  }

  const validFrom = page.getByTestId('epis2-field-validFrom').locator('input');
  if ((await validFrom.inputValue()).trim() === '') {
    await validFrom.click();
    await validFrom.fill('16/06/2026');
    await validFrom.press('Tab');
  }
}

/** Campos SOAP mínimos para borrador evolution_note (CICA + espacio). */
export async function fillMinimalEvolutionDraft(
  page: Page,
  subjective = 'Evolución demo E2E — subjetivo.',
) {
  const richSubjective = page.getByTestId('epis2-field-subjective-rich-input');
  await expect(richSubjective).toBeVisible({ timeout: 15_000 });
  await richSubjective.click();
  await richSubjective.fill(subjective);
  await page.getByLabel('Análisis').fill('Evaluación demo E2E — evolución favorable.');
  await page.getByLabel('Plan').fill('Plan demo E2E — continuar tratamiento y control.');
}

/** CICA — pantalla nueva evolución cargada. */
export async function expectCicaNewEvolutionReady(page: Page) {
  await expect(page.getByTestId('cica-screen-new-evolution')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-cica-evolution-form')).toBeVisible();
  await expect(page.getByTestId('epis2-form-save')).toBeVisible();
}

/** CICA — tab Evoluciones → acción primaria Nueva evolución. */
export async function openCicaNewEvolution(page: Page) {
  await openCicaChartTab(page, 'evoluciones');
  await expect(page.getByTestId('cica-patient-evolutions-screen')).toBeVisible({ timeout: 15_000 });
  const newEvolution = page.getByRole('button', { name: 'Nueva evolución' });
  await expect(newEvolution).toBeVisible();
  await newEvolution.click();
  await expect(page).toHaveURL(/\/evoluciones\/nueva/, { timeout: 15_000 });
  await expectCicaNewEvolutionReady(page);
}

/** CICA — pantalla nueva prescripción cargada. */
export async function expectCicaNewPrescriptionReady(page: Page) {
  await expect(page.getByTestId('cica-screen-new-prescription')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-cica-prescription-form')).toBeVisible();
  await expect(page.getByTestId('epis2-form-save')).toBeVisible();
}

/** CICA — tab Indicaciones → acción primaria Agregar indicación. */
export async function openCicaNewPrescription(page: Page) {
  await openCicaChartTab(page, 'indicaciones');
  await expect(page.getByTestId('cica-patient-orders-screen')).toBeVisible({ timeout: 15_000 });
  const addOrder = page.getByRole('button', { name: 'Agregar indicación' });
  await expect(addOrder).toBeVisible();
  await addOrder.click();
  await expect(page).toHaveURL(/\/indicaciones\/nueva/, { timeout: 15_000 });
  await expectCicaNewPrescriptionReady(page);
}

/** CICA — pantalla nuevo documento cargada. */
export async function expectCicaNewDocumentReady(page: Page) {
  await expect(page.getByTestId('cica-screen-new-document')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-cica-certificate-form')).toBeVisible();
  await expect(page.getByTestId('epis2-form-save')).toBeVisible();
}

/** CICA — tab Documentos → acción primaria Nuevo documento. */
export async function openCicaNewDocument(page: Page) {
  await openCicaChartTab(page, 'documentos');
  await expect(page.getByTestId('cica-patient-documents-screen')).toBeVisible({ timeout: 15_000 });
  const newDocument = page.getByRole('button', { name: 'Nuevo documento' });
  await expect(newDocument).toBeVisible();
  await newDocument.click();
  await expect(page).toHaveURL(/\/documentos\/nuevo/, { timeout: 15_000 });
  await expectCicaNewDocumentReady(page);
}

/** Clave localStorage M3-08 — `EpisThemePreferences`. */
export const EPIS2_THEME_PREFERENCES_KEY = 'epis2-theme-preferences-v2';

export type Epis2ThemePrefsSnapshot = {
  mode?: string;
  accent?: string;
};

export async function getEpis2ThemePreferences(page: Page): Promise<Epis2ThemePrefsSnapshot> {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Epis2ThemePrefsSnapshot) : {};
  }, EPIS2_THEME_PREFERENCES_KEY);
}

export async function setEpis2ThemePreferences(
  page: Page,
  prefs: Partial<Epis2ThemePrefsSnapshot>,
) {
  await page.evaluate(
    ({ key, next }) => {
      const raw = localStorage.getItem(key);
      const current = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      localStorage.setItem(key, JSON.stringify({ ...current, ...next }));
    },
    { key: EPIS2_THEME_PREFERENCES_KEY, next: prefs },
  );
}

/** CICA top bar — controles de tema visibles (modo + acentos rápidos). */
export async function expectCicaThemeControlsVisible(page: Page) {
  await expect(page.getByTestId('cica-theme-controls')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('cica-theme-mode-toggle')).toBeVisible();
  await expect(page.getByTestId('cica-accent-clinicalBlue')).toBeVisible();
  await expect(page.getByTestId('cica-accent-clinicalCalm')).toBeVisible();
}

/** Alterna modo claro/oscuro desde `cica-theme-mode-toggle`. */
export async function toggleCicaDarkMode(page: Page) {
  await page.getByTestId('cica-theme-mode-toggle').click();
}

async function readMuiColorScheme(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    return (
      document.documentElement.getAttribute('data-mui-color-scheme') ??
      document.body.getAttribute('data-mui-color-scheme')
    );
  });
}

/** Modo oscuro activo — localStorage + atributo MUI o fondo del shell CICA. */
export async function expectCicaDarkModeActive(page: Page) {
  await expect(async () => {
    const prefs = await getEpis2ThemePreferences(page);
    expect(prefs.mode).toBe('dark');
  }).toPass({ timeout: 5_000 });

  await expect(async () => {
    const scheme = await readMuiColorScheme(page);
    if (scheme === 'dark') return;
    const shellBg = await page.getByTestId('cica-app-shell').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(shellBg).not.toMatch(/^rgb\(255,\s*255,\s*255\)$/);
  }).toPass({ timeout: 5_000 });
}

/** Modo claro activo — localStorage + atributo MUI. */
export async function expectCicaLightModeActive(page: Page) {
  await expect(async () => {
    const prefs = await getEpis2ThemePreferences(page);
    expect(prefs.mode).toBe('light');
  }).toPass({ timeout: 5_000 });

  await expect(async () => {
    const scheme = await readMuiColorScheme(page);
    if (scheme === 'light') return;
    expect(scheme).not.toBe('dark');
  }).toPass({ timeout: 5_000 });
}

/** CICA nav Más → Apariencia. */
export async function openCicaAppearanceViaNavMore(page: Page) {
  await page.getByTestId('cica-nav-more').click();
  await page.getByTestId('cica-nav-more-appearance').click();
}
