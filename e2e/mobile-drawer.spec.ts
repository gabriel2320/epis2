/**
 * MF-NORM-403 — navegación móvil: bajo el breakpoint medium (<768px) el rail
 * colapsa a un Drawer modal MD3 con trigger de menú. Role-first
 * (docs/quality/E2E_SELECTOR_POLICY.md).
 *
 * PROG-E2E-HYGIENE — censo clínico (EpisAppScaffold), no shell legacy de ficha compacta.
 */
import { test, expect, type Page } from '@playwright/test';
import { loginAsPhysicianApiOnly } from './helpers/demoPatient.js';

test.use({ viewport: { width: 390, height: 844 } });

async function gotoClinicalCensus(page: Page) {
  await page.goto('/espacio/buscar-paciente');
  await expect(page.getByTestId('epis2-clinical-shell')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('epis2-census-command-bar')).toBeVisible();
}

test.describe('Drawer de navegación móvil (viewport 390px)', () => {
  test('el censo colapsa el rail a drawer modal y navega desde él', async ({ page }) => {
    await loginAsPhysicianApiOnly(page);
    await gotoClinicalCensus(page);

    await expect(page.getByTestId('epis2-navigation-rail')).toHaveCount(0);
    const trigger = page.getByRole('button', { name: 'Abrir navegación' });
    await expect(trigger).toBeVisible();

    await trigger.click();
    const drawerNav = page.getByRole('navigation', { name: 'Navegación principal' });
    await expect(drawerNav).toBeVisible();
    const settingsItem = drawerNav.getByTestId('epis2-nav-settings');
    await expect(settingsItem).toBeVisible();

    await settingsItem.click();
    await expect(page).toHaveURL(/\/preferencias-apariencia/);
    await expect(drawerNav).toBeHidden();
  });

  test('en escritorio el rail sigue anclado y no hay trigger móvil', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAsPhysicianApiOnly(page);
    await gotoClinicalCensus(page);

    await expect(page.getByTestId('epis2-navigation-rail')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Abrir navegación' })).toHaveCount(0);
  });
});
