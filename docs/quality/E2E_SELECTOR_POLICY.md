# EPIS2 — Política de selectores E2E (role-first)

**Versión:** 1.0 · 2026-06-10 · **MF:** MF-NORM-402 (Hilo NORM) · Norma R-44

## Regla

Los specs E2E **nuevos** localizan elementos en este orden de preferencia:

1. `getByRole(role, { name })` — botones, links, headings, textboxes (usa el copy de `@epis2/design-system`).
2. `getByLabelText` / `getByPlaceholder` — campos de formulario.
3. `getByText` — contenido estático visible.
4. `getByTestId` — **último recurso**: contenedores sin rol semántico (grids, panes, shells)
   o elementos cuyo nombre accesible es dinámico.

Razón: los selectores por rol prueban lo que el usuario (y el lector de pantalla) percibe;
si un `getByRole` falla, suele haber un problema real de accesibilidad, no solo de test.

## Convenciones

- El `name` se importa desde `copy` de `@epis2/design-system` — nunca strings duplicados.
- Helpers compartidos en [`e2e/support/queries.ts`](../../e2e/support/queries.ts).
- `data-testid` sigue siendo válido para **esperar superficies** (`epis2-clinical-shell`,
  `epis2-patient-workspace`) mientras el contenido se localiza por rol.

## Migración del stock existente

El ~89% de localizadores actuales usa `getByTestId` (auditoría norma 2026-06-10). **No se migra
en masa**: al tocar un spec por otra razón, convertir a role-first los localizadores de
interacción (clicks, fills) de ese spec. Specs nuevos nacen role-first.

## Piloto

[`e2e/a11y-smoke.spec.ts`](../../e2e/a11y-smoke.spec.ts) (MF-NORM-401) está escrito role-first
y sirve de referencia: navegación por roles + axe-core como gate de accesibilidad.
