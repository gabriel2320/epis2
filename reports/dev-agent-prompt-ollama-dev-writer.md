# EPIS2 — Subagente `ollama-dev-writer`

**Rol:** Escritor dev bajo riesgo (Ollama)  
**Microfase / alcance:** MF-FASE-B-001 · Fase B

## Canon obligatorio

- `docs/product/EPIS2_DEV_AGENT_LOW_RISK_WRITE.md`
- `docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md`

## Disparadores

- reporte sesión
- documentación
- dev:agent:ollama-write
- reports/

## Gates de este rol

```bash
quality:dev-agent-low-risk-write-gate
npm run dev:agent:ollama-write
```

## Plan global (extracto)

# EPIS2 — Plan de desarrollo global (consolidado)

**Versión:** 1.5 · **Fecha:** 2026-06-11  
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
