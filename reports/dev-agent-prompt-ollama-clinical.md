# EPIS2 — Subagente `ollama-clinical`

**Rol:** IA clínica local (Ollama producto)  
**Microfase / alcance:** MF-TRAMO-J-002 · Fase B · Tramo J

## Canon obligatorio

- `docs/intelligence/EPIS2_OLLAMA_CAPABILITY_PLAN.md`
- `docs/product/EPIS2_AI_TRAMO_EVALS.md`

## Disparadores

- assist
- blueprint
- local-ai
- RAG

## Gates de este rol

```bash
quality:ollama-structured-output-gate
npm run ai:evals:live
```

## Plan global (extracto)

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
| **L1 Producto** | Olas 0–3, golden journey | Ola 1 ✓ · Ola 2–3 activas |
| **L2 Tramos clínicos** | A–K (urgencias, UCI, OR, farmacia…) | A–I ✓ · J pendiente |
| **L3 UX densidad** | MF-UI-SIMPLIFY-M3 scaffold | ✓ base |
| **L4 RAD productividad** | MF-RAD-M3 disciplina VB→MD3 | ✓ Hilo A |
| **L5 clinical-productivity** | `@epis2/clinical-productivity` wrappers | ✓ base · puente vía `ClinicalDataGrid` |
| **L6 Tramo J** | Farmacia 161–170 | Scaffold ✓ · grid `partial` · signoff clínico pendiente |

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

### Hilo B — Completitud Ola 2 (**activo** · CI E2E ✓ 2026-06-09)

- [x] `ClinicalCommandPalette` Ctrl+K (`ClinicalShellCommandPalette`)
- [x] Autocomplete búsqueda paciente (`PatientSearchAutocomplete`)
- [x] Journey `golden-v2-admission-discharge` — CI 10/10 E2E [27181266125](https://github.com/gabriel2320/epis2/actions/runs/27181266125)
- [x] RAD `clinical-form-evolution` + `draft-review` → `done`

## Plan tramo J

# EPIS2 — Plan Tramo J (farmacia clínica)

**Versión:** 1.0 · **Fecha:** 2026-06-07

---

## Secuencia canon

Ola 16 — farmacia clínica IDC 161–170 bajo tab farmacia (`?tab=pharmacy`).

**Horizonte:** Post-core — scaffold demo → cierre técnico.

---

## Estado

| Programa | IDC | EPIS2 hoy |
|----------|-----|-----------|
| Y-Site | 161 | ✅ **MF-TRAMO-J-002** |
| Dosis renal | 162 | ✅ **MF-TRAMO-J-003** |
| TDM | 163 | ✅ **MF-TRAMO-J-004** |
| RAM | 164 | ✅ **MF-TRAMO-J-005** |
| Conciliación | 165 | ✅ **MF-TRAMO-J-006** (core Done) |
| Dispensación | 166 | ✅ **MF-TRAMO-J-007** |
| Carro paro | 167 | ✅ **MF-TRAMO-J-008** |
| Estupefacientes | 168 | ✅ **MF-TRAMO-J-009** |
| Devolución | 169 | ✅ **MF-TRAMO-J-010** |
| Quiebre stock | 170 | ✅ **MF-TRAMO-J-011** |

---

## Microfases

| MF | Alcance | Estado |
|----|---------|--------|
| MF-TRAMO-J-001 | Inventario farmacia clínica | ✅ |
| MF-TRAMO-J-002 … J-011 | Scaffold paneles 161–170 | ✅ |
| MF-TRAMO-J-CLOSURE | Cierre técnico Tramo J | ✅ |

---

## Gates

Ver [`EPIS2_TRAMO_J_CLOSURE.md`](./EPIS2_TRAMO_J_CLOSURE.md).


Inventario: docs/product/EPIS2_TRAMO_J_PHARMACY_INVENTORY.md

## Reglas EPIS2 (no negociables)

- Home = `/comando` — nunca dashboard como home
- PostgreSQL = SoT; IA no firma ni aprueba
- Sin import desde `../Epis` sin `legacy-import-manifest.json`
- No commit ni push salvo orden explícita del humano
- Cerrar sesión con reporte en `reports/`

## Entregables

1. Cambios mínimos acotados al alcance
2. `npm run check` + gates del rol
3. Reporte `reports/epis2-*.md` con riesgos y próximo paso

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
