# EPIS2 — Cierre sesión CI E2E

**Fecha:** 2026-06-09  
**Commit HEAD:** `7993f2c`  
**CI final:** [27181266125](https://github.com/gabriel2320/epis2/actions/runs/27181266125) ✅ (~8m 42s)

---

## Alcance

Corrección de specs E2E que fallaban en CI con `vite preview` (4 → 0 fallos).

**Archivos tocados:**

- `e2e/clinical-textbox-evolution-draft.spec.ts`
- `e2e/golden-v2-admission-discharge.spec.ts`
- `e2e/ux-g02-command-first.spec.ts`
- `reports/archive/2026-06/epis2-ci-e2e-closure-2026-06-09.md`

---

## Gates (run 27181266125)

| Gate | Estado |
|------|--------|
| `npm run check` | ✅ |
| `quality:pm01` · `theme:validate` | ✅ |
| `npm run test` · `quality:ci-parity` | ✅ |
| `test:e2e` | ✅ **10/10** (20.1s) |
| `db:validate` · `ai:evals` · `quality:golden-journey` | ✅ |

---

## Decisiones clave

1. Login E2E vía API (`loginAsPhysician`), no UI MUI select.
2. Panel historial ficha (`epis2-ficha-history`) antes de CTAs longitudinales.
3. UX-G02 sin `VITE_ENABLE_DEMO_NARRATIVES` — `pinDemoCase` + comando.
4. Pegado clinical-textbox: `ClipboardEvent` en paste-zone (preview/headless).
5. Navegación a borrador: botón **Firmar** (`epis2-form-sign`), no Guardar (producto UX-G03).

---

## Riesgos

- Specs que asumen `getByLabel` en MUI Select pueden volver a romperse; preferir `getByRole('combobox')` en formulario.
- `tramo-c-admission.spec.ts` aún espera CTA ingreso visible sin abrir historial — posible drift futuro.

---

## Próximo paso

Retomar **Fase B / Tramo J farmacia** según `docs/product/EPIS2_GLOBAL_DEV_PLAN.md` (`quality:microphase-next`).
