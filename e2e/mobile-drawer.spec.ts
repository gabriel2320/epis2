/**
 * MF-NORM-403 — navegación móvil: bajo el breakpoint medium (<768px) el rail
 * colapsa a un Drawer modal MD3 con trigger de menú. Role-first
 * (docs/quality/E2E_SELECTOR_POLICY.md).
 */
import { test, expect, type Page } from '@playwright/test';
import { getDemoCaseByCode } from '@epis2/test-fixtures';

test.use({ viewport: { width: 390, height: 844 } });

/** Login por API sin pasar por /comando — el hero del Centro de Comando no es el SUT móvil. */
async function loginAsPhysicianApiOnly(page: Page) {
  const login = await page.request.post('/api/auth/login', {
    data: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
  });
  if (!login.ok()) {
    throw new Error(`login médico demo falló (HTTP ${login.status()})`);
  }
  const state = await page.request.storageState();
  await page.context().addCookies(state.cookies);
}

test.describe('Drawer de navegación móvil (viewport 390px)', () => {
  test('la ficha colapsa el rail a drawer modal y navega desde él', async ({ page }) => {
    await loginAsPhysicianApiOnly(page);

    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 no encontrado en fixtures');
    await page.goto(`/espacio/ficha?patientId=${demo.patientId}`);
    await expect(page.getByTestId('epis2-patient-workspace')).toBeVisible({ timeout: 15_000 });

    // Rail anclado oculto en compact; trigger de menú visible.
    await expect(page.getByTestId('epis2-navigation-rail')).toHaveCount(0);
    const trigger = page.getByRole('button', { name: 'Abrir navegación' });
    await expect(trigger).toBeVisible();

    // Abrir drawer modal: navegación principal con los mismos items del rail.
    await trigger.click();
    const drawerNav = page.getByRole('navigation', { name: 'Navegación principal' });
    await expect(drawerNav).toBeVisible();
    const settingsItem = drawerNav.getByTestId('epis2-nav-settings');
    await expect(settingsItem).toBeVisible();

    // Navegar desde el drawer: cierra y cambia de ruta.
    await settingsItem.click();
    await expect(page).toHaveURL(/\/preferencias-apariencia/);
    await expect(drawerNav).toBeHidden();
  });

  test('en escritorio el rail sigue anclado y no hay trigger móvil', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAsPhysicianApiOnly(page);

    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 no encontrado en fixtures');
    await page.goto(`/espacio/ficha?patientId=${demo.patientId}`);
    await expect(page.getByTestId('epis2-patient-workspace')).toBeVisible({ timeout: 15_000 });

    await expect(page.getByTestId('epis2-navigation-rail')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Abrir navegación' })).toHaveCount(0);
  });
});
