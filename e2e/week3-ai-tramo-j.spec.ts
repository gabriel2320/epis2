/**
 * MF-DEV-WEEK3 — Catálogo visual + frontera assist (Tramo J activo).
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Semana 3 — IA producto en el loop', () => {
  test('catálogo visual dev accesible con sesión', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/desarrollo/catalogo-visual');
    await expect(page).toHaveURL(/\/desarrollo\/catalogo-visual/);
  });

  test('API ai/status responde contrato tras login', async ({ page }) => {
    await loginAsPhysician(page);
    const status = await page.request.get('/api/ai/status');
    expect(status.ok()).toBeTruthy();
    const body = (await status.json()) as { available: boolean; requiresHumanReview?: boolean };
    expect(typeof body.available).toBe('boolean');
  });
});
