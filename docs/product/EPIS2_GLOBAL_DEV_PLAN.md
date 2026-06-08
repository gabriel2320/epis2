# EPIS2 — Plan de desarrollo global (consolidado)

**Versión:** 1.2 · **Fecha:** 2026-06-04  
**Fuentes fusionadas:** `ROADMAP.md` · `EPIS2_COMPLETION_ROADMAP.md` · MF-UI-SIMPLIFY · MF-RAD-M3 · MF-CLINICAL-PRODUCTIVITY · tramos A–K

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
| **L4 RAD productividad** | MF-RAD-M3 disciplina VB→MD3 | ✓ Fase A dashboard |
| **L5 clinical-productivity** | `@epis2/clinical-productivity` wrappers | ✓ base · puente vía `ClinicalDataGrid` |
| **L6 Tramo J** | Farmacia 161–170 | Scaffold ✓ · grid `partial` · signoff clínico pendiente |

Detalle de puente L4→L5: `docs/product/EPIS2_UI_LAYERS.md`.

---

## Hilo activo recomendado (Q2 2026)

### Fase A — Consolidación visual (**cerrada** 2026-06-04)

- [x] MF-UI-SIMPLIFY: scaffold, scroll único, ActionBar única
- [x] MF-RAD-M3: superficies, registry, modo diseño, gates
- [x] MF-CLINICAL-PRODUCTIVITY: paquete, gates, piloto `PatientListGrid`
- [x] Dashboard tabs densos → `EpisRadDashboardTabShell` + grids (work, service, nursing, emergency, icu, specialty, patient, quality)
- [x] `EpisBulkActionMenu` en listas de trabajo / mapa camas UCI
- [x] Acordeones sistemáticos en formularios largos + monitoreo UCI + farmacia/especialidad secundario
- [x] Quality dashboard tab → migración grid completa
- [x] Programa microfases MF-151→182 DONE (`quality:microphases`)

Command palette Ctrl+K → **Fase B** (componente L5 existe; falta cableado en `EpisAppScaffold`).

### Fase B — Completitud Ola 2 + subagentes dev (**activa**)

- [x] `ClinicalCommandPalette` Ctrl+K en shell global (`ClinicalShellCommandPalette`)
- [x] Autocomplete búsqueda paciente (`PatientSearchAutocomplete`)
- [x] Journey Playwright `golden-v2-admission-discharge` UI
- [x] RAD `clinical-form-evolution` + `draft-review` → `done`
- [ ] Procedimiento clínico blueprint
- [ ] Cierre encuentro operativo UI
- Orquestación: `npm run dev:agent:orchestrate` · plan Ollama `npm run dev:agent:ollama`

### Fase C — Ola 3 longitudinal

- Ficha hub estable (split pane ✓)
- Documentos + resultados bandeja plana (results-inbox ✓)
- CTAs vacíos → formulario (alergia, problema)

### Fase D — Tramo J farmacia (post Fase B)

Precedencia: Fase B palette + búsqueda → `dashboard-pharmacy` `migration: done` → signoff UX-G02 + clínico institucional.

`layers-integration-gate` ✓ — ya no bloquea scaffold J; bloquea **piloto producción** farmacia.

---

## Mapa de microfases UI (no paralelizar registries)

| ID | Objetivo | Gate |
|----|----------|------|
| MF-UI-01 | `/comando` decisión | command-center-layout |
| MF-UI-SIMPLIFY | Scaffold M3 | ui-simplify-gate |
| MF-RAD-M3 | Disciplina RAD + modo diseño | rad-m3-discipline |
| MF-RAD-M3-A | Grids dashboard + acordeones | grid-surface + form-collapse |
| MF-CLINICAL-PRODUCTIVITY | Wrappers utilitarios | clinical-productivity-gate |
| MF-LAYERS-INTEGRATION | Meta L3+L4+L5 | layers-integration-gate |
| MF-UI-05 | Form acordeones | form-collapse-gate ✓ |
| MF-UI-06 | Grillas vs cards | grid-surface-gate ✓ |

---

## Definition of Done (toda sesión)

```bash
npm run check
npm run test
npm run db:validate
npm run quality:layers-integration-gate
```

Reporte en `reports/` con alcance, gates, riesgos, próximo paso.

---

## Riesgos globales

1. **Dashboard secundario** compite visualmente con comando — mantener como tablero, no home.
2. **Cards proliferan** en tramos — gate RAD convierte a Grid.
3. **Lógica en JSX** — revisión PR: páginas delgadas, superficies tontas.
4. **Tramo J antes de densidad** — rechazado por canon de olas.
5. **Duplicación L4/L5** — usar `DashboardHomogeneousGrid` → `ClinicalDataGrid`; no importar `@mui/x-data-grid` en pantallas.

---

## Frase guía

> Productividad de Visual Basic, estética Material Design 3, arquitectura EPIS2 limpia.
