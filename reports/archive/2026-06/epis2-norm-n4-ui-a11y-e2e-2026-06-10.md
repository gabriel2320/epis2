# EPIS2 — Hilo NORM · Tramo N4 (UI, accesibilidad y E2E) — cierre

**Fecha:** 2026-06-10 · **Plan:** [`EPIS2_NORMA_FULLSTACK_PLAN.md`](../docs/product/EPIS2_NORMA_FULLSTACK_PLAN.md) · **Pendiente:** PEND-012

## Microfases

| MF | Alcance | Commit | Gate de cierre |
|----|---------|--------|----------------|
| MF-NORM-401 | Smoke axe-core (`@axe-core/playwright`) sobre Centro de Comando, ficha y formulario clínico; umbral 0 violaciones `serious`/`critical`; role-first | `75097fb` | spec creada; hallazgos reales → 401b |
| MF-NORM-401b | Violaciones corregidas: `button-name` (aria-label en rail), `color-contrast` (CTAs → `primary.dark`), `label-title-only` (id asociable en `EpisDatePicker`), `list` (scrollspy `ul>li`); `a11y-smoke` en `test:e2e` (CI) | `3ce3d46` | 3 specs a11y con 0 serious/critical ✓ |
| MF-NORM-402 | Política selectores role-first (`E2E_SELECTOR_POLICY.md` + `e2e/support/queries.ts`); specs nuevos `getByRole`/`getByLabel`, stock `getByTestId` migración oportunística | `75097fb` | piloto = spec a11y role-first ✓ |
| MF-NORM-403 | Drawer móvil: bajo breakpoint medium (<768px) `EpisAppShellLayout` colapsa el rail a `EpisMobileNavDrawer` (Drawer modal MD3, mismos items/data-testid, trigger «Abrir navegación»); story + unit jsdom + e2e 390px (`test:e2e:mobile`, en `test:e2e`) | `779a618` | e2e 390px 2/2 ✓ + `quality:three-modes-gate` ✓ |
| MF-NORM-404 | Server→field errors en RHF: `applyServerFieldErrors` mapea `details` del envelope (`body.<fieldId>`) a `setError(type: 'server')`; cableado en `useGeneratedFormDraftPersistence`; API emite `details` en 400 de drafts | `dd8f997` | 3 unit mapeo ✓ + integración 400 `details.path=patientId` ✓ |

## Decisiones

- **Drawer en `epis2-ui`, no en `apps/web`:** el colapso vive en `EpisAppShellLayout`
  (todos los consumidores lo heredan sin tocar registries); el drawer reusa items y
  `data-testid` del rail para que los flujos E2E sirvan en ambos modos.
- **Breakpoint tokens propios:** `epis2MediaQueries.compactOnly` (<768px), no el `md` de MUI,
  para coherencia con `EpisCommandCenterLayout`/`EpisSplitPane`.
- **Hallazgo de test harness:** `globals: false` en `vitest.config.ts` desactiva el
  auto-cleanup de Testing Library — tests con múltiples `render` necesitan `afterEach(cleanup)`.
  El stub de `matchMedia` debe definirse vía `vi.hoisted` (MUI lo captura por render, pero el
  entorno jsdom no lo trae).

## Gates de cierre del tramo

| Gate | Resultado |
|------|-----------|
| `npm run check` | ✓ (lint + typecheck + 18 gates `architecture:validate`; revalidado por hook pre-push de `779a618`) |
| `npm run test` | ✓ (ver nota: corre con trabajo paralelo drug-intel en el working tree) |
| `npm run test:e2e` (set CI, 20 specs) | a11y 3/3 ✓ + mobile 2/2 ✓ (set completo validado en CI del push) |
| `quality:three-modes-gate` | ✓ |

## Re-auditoría §4 / §5 / §10 (vs [auditoría 2026-06-10](./epis2-norma-fullstack-compliance-2026-06-10.md))

| Sección | Antes | Ahora | Evidencia | Brecha restante |
|---|---|---|---|---|
| §4 MD3 R-06…R-12 | 🟢/🟡 | 🟢 | Drawer móvil MD3 (R-11, `779a618`); axe-core 0 serious/critical en CI (R-12, `3ce3d46`) | Gate de px arbitrarios (nice-to-have, sin regla bloqueante) |
| §5 React/TS R-13…R-19 | 🟡 | 🟢 | `tsconfig` web extiende base (R-13, `6584d31`, N1); server→field errors RHF (`dd8f997`) | 2 componentes >600 líneas (refactor oportunístico) |
| §10 Pruebas R-41…R-44 | 🟡 | 🟢/🟡 | Política role-first + helpers (R-44); axe en CI; specs nuevos role-first (a11y, mobile) | Stock 89% `getByTestId` se migra oportunísticamente; MSW sigue como no-acción justificada |

**Cumplimiento estimado del hilo:** ≈70% → **≈85%**. Para el objetivo ≥90% faltan
MF-NORM-203 (OTel mínimo, R-47) y MF-NORM-301 (OpenAPI desde Zod, R-33) — ambas
introducen dependencias npm y quedan **en pausa deliberada** hasta que el trabajo
paralelo drug-intel (que modifica `package.json`/`package-lock.json`) esté commiteado.

## Estado del hilo NORM

```text
N1 ✓ (101…105) · N2 201 ✓ 202 ✓ · 203 pausada (npm install)
N3 302 ✓ 303 ✓ · 301 pausada (npm install) · N4 ✓ (401, 401b, 402, 403, 404)
13/16 microfases cerradas
```

## Próximo paso exacto

1. Al commitear drug-intel: MF-NORM-203 (OTel) → MF-NORM-301 (OpenAPI) → re-auditoría final ≥90%.
2. Cierre N2 pendiente de 203 (§11 pasa a 🟢 con OTel; correlationId + pino ya en verde).
