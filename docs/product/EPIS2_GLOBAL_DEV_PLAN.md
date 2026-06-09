# EPIS2 — Plan de desarrollo global (consolidado)

**Versión:** 1.4 · **Fecha:** 2026-06-09  
**Sistema:** [`EPIS2_DEV_SYSTEM.md`](./EPIS2_DEV_SYSTEM.md) (SDEPIS2) · **Tablero:** [`EPIS2_TABLERO.md`](./EPIS2_TABLERO.md)  
**Fuentes:** `ROADMAP.md` · `EPIS2_COMPLETION_ROADMAP.md` · MF-UI-SIMPLIFY · MF-RAD-M3 · tramos A–K

> Vocabulario: **Hilo** (secuencia activa) · **Ola** (capacidad) · **Tramo** (dominio clínico) · **Microfase** (sesión) · **Entrega** (PR acotado). «Fase A/B» = **Hilo A/B** (deprecado).

---

## Norte único

```text
Login → Centro de Comando → paciente → intención → formulario mínimo → borrador → aprobación humana
```

Home = `/comando`. PostgreSQL = SoT. IA no firma. Sin OpenMRS/Carbon en UI.

---

## Capas de ejecución (orden de precedencia)

| Capa | Qué | Estado |
|------|-----|--------|
| **L0 Invariantes** | `PRODUCT_INVARIANTS.md`, architecture:validate | Permanente |
| **L1 Producto** | Olas 0–3, golden journey | Ola 1 ✓ · Ola 2 Hilo B ✓ · Ola 3 activa |
| **L2 Tramos clínicos** | A–K (urgencias, UCI, OR, farmacia…) | A–J ✓ scaffold · signoff clínico Tramo J cerrado |
| **L3 UX densidad** | MF-UI-SIMPLIFY-M3 scaffold | ✓ base |
| **L4 RAD productividad** | MF-RAD-M3 disciplina VB→MD3 | ✓ Hilo A |
| **L5 clinical-productivity** | `@epis2/clinical-productivity` wrappers | ✓ base · puente vía `ClinicalDataGrid` |
| **L6 Tramo J** | Farmacia 161–170 | Scaffold ✓ · signoff PEND-001 cerrado 2026-06-09 |

Detalle L4→L5: `docs/product/EPIS2_UI_LAYERS.md`.

---

## Hilos activos (Q2 2026)

### Hilo A — Consolidación visual (**cerrado** 2026-06-04)

- [x] MF-UI-SIMPLIFY: scaffold, scroll único, ActionBar única
- [x] MF-RAD-M3: superficies, registry, modo diseño, gates
- [x] MF-CLINICAL-PRODUCTIVITY: paquete, gates, piloto `PatientListGrid`
- [x] Dashboard tabs densos → `EpisRadDashboardTabShell` + grids
- [x] Acordeones formularios + monitoreo UCI + farmacia secundario
- [x] Programa microfases MF-151→182 DONE (`quality:microphases`)

Command palette Ctrl+K → **Hilo B**.

### Hilo B — Completitud Ola 2 (**cerrado** 2026-06-09)

- [x] `ClinicalCommandPalette` Ctrl+K (`ClinicalShellCommandPalette`)
- [x] Autocomplete búsqueda paciente (`PatientSearchAutocomplete`)
- [x] Journey `golden-v2-admission-discharge` — CI 10/10 E2E [27222014998](https://github.com/gabriel2320/epis2/actions/runs/27222014998)
- [x] RAD `clinical-form-evolution` + `draft-review` → `done`
- [x] Blueprint `procedure_request` + comando `request_procedure` (IDC 57)
- [x] Cierre encuentro UI + API (`outpatient_visit.closeEncounter`)
- [x] `dashboard-pharmacy` → `done`
- [x] Cierre técnico · [`epis2-hilo-b-closure-2026-06-09.md`](../../reports/epis2-hilo-b-closure-2026-06-09.md)
- ~~Nota procedimiento clínica (≠ solicitud)~~ → **PEND-002 defer** Ola 2+/3 (no bloquea cierre)

### Hilo C — Ola 3 longitudinal (**activo**)

- Ficha hub (split pane ✓)
- [x] Documentos UI compacta · CTAs alergia/problema · timeline invocable
- Resultados bandeja plana (results-inbox ✓)

### Hilo D — Tramo J farmacia (**cerrado** 2026-06-09)

- [x] Scaffold IDC 161–170 · `fa38e4d` · gates Tramo J 6/6 · E2E 2/2 · UX-G02 9/9
- [x] PEND-001 signoff · [`epis2-tramo-j-signoff-2026-06-09.md`](../../reports/epis2-tramo-j-signoff-2026-06-09.md)

### Hilo UX-1 — PROG-THREE-MODES / **EPIS2-PM-01** (**cerrado** 2026-06-04)

- [x] MF-THREE-MODES-01…08 · gates `quality:pm01` · E2E `three-modes-journey`

Docs: `EPIS2_MODES_LAYER.md` · `EPIS2_THREE_MODES_DEV_PLAN.md`

> **No confundir:** Hilo ≠ **Tramo E** (pabellón) · EPIS2-13 = Hospitalización V2 (hito producto).

---

## Mapa microfases UI (no paralelizar registries)

| ID | Objetivo | Gate |
|----|----------|------|
| MF-UI-SIMPLIFY | Scaffold M3 | ui-simplify-gate |
| MF-RAD-M3 | Disciplina RAD + modo diseño | rad-m3-discipline |
| MF-CLINICAL-PRODUCTIVITY | Wrappers utilitarios | clinical-productivity-gate |
| MF-LAYERS-INTEGRATION | Meta L3+L4+L5 | layers-integration-gate |
| MF-THREE-MODES-01…08 | Tres modos (EPIS2-PM-01) | `quality:pm01` ✓ |

---

## Definition of Done (toda sesión)

```bash
npm run check
npm run test
npm run db:validate
npm run quality:layers-integration-gate
```

Reporte en `reports/` · actualizar [`EPIS2_TABLERO.md`](./EPIS2_TABLERO.md) si cambia el siguiente paso.

---

## Riesgos globales

1. Modo tablero `/epis2/dashboard` no compite con home comando.
2. Cards en tramos → gate RAD convierte a Grid.
3. Tramo J antes de densidad — rechazado por canon de olas.
4. Storybook ≠ tablero de desarrollo — ver SDEPIS2.

---

## Frase guía

> Productividad de Visual Basic, estética Material Design 3, arquitectura EPIS2 limpia.
