# EPIS2 — Tablero de desarrollo

**Actualizado:** 2026-06-11 · **HEAD:** ver git log

Sistema: [`EPIS2_DEV_SYSTEM.md`](./EPIS2_DEV_SYSTEM.md) · Nomenclatura: **Entrega C-n** = unidad dentro de **Hilo C** (reemplaza P1/P1b/P1c/P1d) · Auditoría: [`reports/epis2-audit-avance-proyecto-2026-06-09.md`](../../reports/epis2-audit-avance-proyecto-2026-06-09.md)

---

## Hecho

| Entrega / hito | Evidencia |
|----------------|-----------|
| CI pipeline completo | run [27222014998](https://github.com/gabriel2320/epis2/actions/runs/27222014998) — check, test, ci-parity, **10/10 E2E**, db:validate, golden-journey |
| Fix ci-parity (sin doble vitest) | `15b6131` · `--from-report` · ci-parity ~1s en CI |
| Entrega CI-E2E | `7993f2c` — Firmar → borrador; paste-zone; ficha-history |
| PROG-THREE-MODES MF-01…08 | `quality:pm01` ✓ · `three-modes-journey` E2E |
| **Hilo A** — consolidación visual | RAD dashboard, acordeones, MF-151→182 |
| **Hilo UX-1** — tres modos MD3 | EPIS2-PM-01 cerrado |
| **Hilo B** — Ola 2 productividad | Palette · autocomplete · golden V2 · procedure_request · cierre encuentro · farmacia · [`epis2-hilo-b-closure-2026-06-09.md`](../../reports/epis2-hilo-b-closure-2026-06-09.md) |
| Golden V2 UI E2E | `golden-v2-admission-discharge` ✓ |
| UX-G02 command-first E2E | Partes A/B/C1 ✓ |
| E2E Tramo C admission | `tramo-c-admission` 3/3 · [`epis2-tramo-c-admission-e2e-fix-2026-06-09.md`](../../reports/epis2-tramo-c-admission-e2e-fix-2026-06-09.md) |
| **Hilo D** — Tramo J farmacia | PEND-001 cerrado · `fa38e4d` · [`epis2-tramo-j-signoff-2026-06-09.md`](../../reports/epis2-tramo-j-signoff-2026-06-09.md) |
| **Piloto M3 automatizado** (V1–V6) | `2d77bfe` · `quality:m3-human-pilot` OK · 6/6 E2E · [`epis2-m3-human-pilot-2026-06-09.md`](../../reports/epis2-m3-human-pilot-2026-06-09.md) |
| Hito auditoría profunda | [`epis2-auditoria-profunda-2026-06-09.md`](../../reports/epis2-auditoria-profunda-2026-06-09.md) — plan 5 entregas |
| Entrega auditoría F1 — higiene | `b27fdcd` · [`epis2-auditoria-fase1-higiene-2026-06-09.md`](../../reports/epis2-auditoria-fase1-higiene-2026-06-09.md) |
| Entrega auditoría F2 — robustez | `fb5ba23` · transacción approveDraft · JWT rol · E2E print en CI · [`epis2-auditoria-fase2-robustez-2026-06-09.md`](../../reports/epis2-auditoria-fase2-robustez-2026-06-09.md) |
| Entrega auditoría F3 — pulido M3 | `9b2b073` · tertiary + surfaceContainer* runtime · EpisDraftStatus roles clínicos · Admin/DraftReview al DS · motion a11y · [`epis2-auditoria-fase3-pulido-m3-2026-06-09.md`](../../reports/epis2-auditoria-fase3-pulido-m3-2026-06-09.md) |
| Entrega auditoría F4 — deuda estructural | side-effects approveDraft modulares · GeneratedClinicalFormPage dividido · tabla control migraciones · tests admin/DraftReview/TabShell · layers-gate en CI · [`epis2-auditoria-fase4-deuda-2026-06-09.md`](../../reports/epis2-auditoria-fase4-deuda-2026-06-09.md) |
| **Entrega C — impresión Carta** — epicrisis | `PrintLetterDocument` + `/espacio/epicrisis/imprimir` · E2E en CI · gate ampliado · [`epis2-p1-print-discharge-letter-2026-06-09.md`](../../reports/epis2-p1-print-discharge-letter-2026-06-09.md) |
| Auditoría II — inventario + limpieza + documental | Inventario completo · código muerto anclado por gates · plan F1–F5 · [`epis2-auditoria-inventario-limpieza-2026-06-09.md`](../../reports/epis2-auditoria-inventario-limpieza-2026-06-09.md) |
| **F1+F2 — limpieza + PEND-006 código cerrado** | 3 componentes muertos fuera · registry `PRINTABLE_BLUEPRINTS` · lab/imagen A5 + E2E · [`epis2-f1-f2-limpieza-print-2026-06-09.md`](../../reports/epis2-f1-f2-limpieza-print-2026-06-09.md) |
| **F4 — sesión documental** | Brief sync con tablero · norma print v1.1 · banners históricos · `docs/INDEX.md` + `reports/INDEX.md` · [`epis2-f4-sesion-documental-2026-06-09.md`](../../reports/epis2-f4-sesion-documental-2026-06-09.md) |
| **Entrega C-2 (parcial)** — alto contraste + Storybook Print* | Roles outline/onSurfaceVariant/foco (3.6 ✓ código) · stories Carta + receta/lab A5 · signoff Calm Premium pendiente · [`epis2-p1b-alto-contraste-storybook-print-2026-06-09.md`](../../reports/epis2-p1b-alto-contraste-storybook-print-2026-06-09.md) |
| **Hilo M3-R — state layers + foco + escalera superficies** | R1–R7 ✓ código: action 8/10/10 · focus-visible universal · emphasized real · two-pane/rail en escalera tonal · roles inverse/scrim/dim expuestos · labelMedium→caption · docs reconciliados · [`epis2-m3-r-state-layers-superficie-2026-06-09.md`](../../reports/epis2-m3-r-state-layers-superficie-2026-06-09.md) |
| Housekeeping árbol (#6 #3 #1) | v4/v5 → interop/ y ai/ · `tests/README.md` (golden vitest ≠ e2e) · gate `web-components-root-frozen` · [`epis2-housekeeping-arbol-2026-06-09.md`](../../reports/epis2-housekeeping-arbol-2026-06-09.md) |
| **PEND-011 — CI rojo print E2E cerrado** | Carrera auth en carga fría (guard `GeneratedClinicalFormPage` vs `isLoading`) · paridad CI local 5/5 · `test:e2e` 15/15 · [`epis2-pend011-ci-print-e2e-fix-2026-06-10.md`](../../reports/epis2-pend011-ci-print-e2e-fix-2026-06-10.md) |
| **Hilo NORM — PEND-012 cerrado** | 16/16 MF · ≈90% norma full stack · [`epis2-norm-hilo-close-2026-06-10.md`](../../reports/epis2-norm-hilo-close-2026-06-10.md) |
| **Entrega C-1 (automatizada)** — signoff visual M3 V1–V6 | `quality:m3-signoff` ✓ · `quality:m3-visual-pass` ✓ (16 capturas) · post NORM (a11y, drawer móvil, alto contraste) · [`epis2-m3-visual-pass-2026-06-10.md`](../../reports/epis2-m3-visual-pass-2026-06-10.md) |
| **PROG-DUAL-CHART** MF-DUAL-CHART-00…09 | `eab749c` · ledger 10/10 DONE · gates DC-00…09 ✓ · [`epis2-dual-chart-audit-2026-06-10.md`](../../reports/epis2-dual-chart-audit-2026-06-10.md) |
| **PROG-AUTO-DEV-6H** H-AUTO-0…6 | Ledger DONE · ejecución **pausada** 2026-06-11 · desarrollo manual vía `dev:session` |

---

## En curso

| Hilo | Entrega activa | Notas |
|------|----------------|-------|
| **Hilo C** — Ola 3 longitudinal | **C-1** (humano opcional) | Receta A5 ✓ · piloto M3 ✓ · [`epis2-hilo-c-p1-print-prescription-2026-06-09.md`](../../reports/epis2-hilo-c-p1-print-prescription-2026-06-09.md) |

---

## Siguiente

| Entrega | Alcance | Gate |
|---------|---------|------|
| **C-1** | Revisión humana opcional post-captura M3 (hover/foco/rail/two-pane claro/oscuro) — evidencia en `reports/m3-visual-evidence/2026-06-10/` | Automatizado ✓ · [`epis2-m3-visual-pass-2026-06-10.md`](../../reports/epis2-m3-visual-pass-2026-06-10.md) |
| **C-2** | **PROG-CALM-PREMIUM** — tramos `THEME-CALM-01` + `UX-AESTHETIC P3` (8 paletas MTB · forma cuadrada traditional · barra comando) | [`EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN.md`](../design/EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN.md) · [`EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md`](../design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md) · signoff NO-GO |
| **C-3** | **Entrega C-3a** ✓ scaffold · **C-3b** pendiente — MF-CLINICAL-SUMMARY-B + tramo `UX-CALM-PATIENT` | [`EPIS2_CLINICAL_SUMMARY_MD3.md`](../design/EPIS2_CLINICAL_SUMMARY_MD3.md) |
| **C-4** | Activar dual ficha en prod (`VITE_ENABLE_DUAL_CHART_MODES=true`) + E2E CI opt-in | CI job `e2e-dual-chart` ✓ · prod flag off · local/staging manual |
| backlog | Patrón combobox MUI en E2E (PEND-004) | Helper / docs testing |
| backlog | Ola 2+ — nota procedimiento clínica (PEND-002 defer) | No bloquea Hilo C |

`npm run quality:microphase-next` → ledger MF cerrado; seguir **Hilo C** · entregas **C-1→C-4** en [`EPIS2_GLOBAL_DEV_PLAN.md`](./EPIS2_GLOBAL_DEV_PLAN.md).

**Plan maestro por partes (evaluar · revisar · mejorar · seguir):** [`reports/epis2-plan-maestro-desarrollo-por-partes-2026-06-11.md`](../../reports/epis2-plan-maestro-desarrollo-por-partes-2026-06-11.md) — dual ficha + barra comando transversal + agentes.

---

## Backlog / riesgo

| Ítem | Impacto |
|------|---------|
| PEND-002 defer | Nota post-procedimiento (IDC 58+) — no bloquea Ola 2 |
| MUI Select en E2E | `getByRole('combobox')` en formularios |
| Dependabot zod 4.x | PR aparte |
| **Storybook** (herramienta UI) | 12 stories; ampliar por IDC |
| Evolab | Repo externo [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) · 24 hallazgos abiertos |
| PROG-AUTO-DEV-6H | Pausado — no relanzar `dev:auto:cycle` sin decisión explícita |

---

## Capas (snapshot)

```text
L0 Invariantes     ████████████████████  permanente
L1 Ola 1           ██████████████████░░  CE + shell · hitos 1C/1D partial
L2 Tramos A–J      ████████████████████  scaffold · Tramo J signoff cerrado
L3 UX densidad     ████████████████████  MF-UI-SIMPLIFY done
L4 RAD MD3         ████████████████████  Hilo A done
L5 clinical-prod   ██████████████████░░  base · piloto M3 automatizado OK · extensión clínica pendiente
L6 Tramo J         ████████████████████  signoff PEND-001 cerrado 2026-06-09
L1 Ola 2 Hilo B    ████████████████████  cerrado 2026-06-09 · PEND-002 defer
```

Reporte cierre Hilo B: `reports/epis2-hilo-b-closure-2026-06-09.md` · Pendientes: `reports/epis2-pendientes-registro-2026-06-09.md`
