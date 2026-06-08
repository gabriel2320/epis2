# EPIS2 — Subagente `layers-integrator`

**Rol:** Integrador capas L3+L4+L5  
**Microfase / alcance:** MF-FASE-B-001 · Fase B

## Canon obligatorio

- `docs/product/EPIS2_UI_LAYERS.md`
- `docs/product/EPIS2_GLOBAL_DEV_PLAN.md`

## Disparadores

- MF-RAD-M3
- MF-CLINICAL-PRODUCTIVITY
- dashboard tab
- EpisRadDashboardTabShell

## Gates de este rol

```bash
quality:layers-integration-gate
quality:ui-simplify-gate
```

## Plan global (extracto)

# EPIS2 — Plan de desarrollo global (consolidado)

**Versión:** 1.1 · **Fecha:** 2026-06-07  
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
| **L6 Tramo J** | Farmacia 161–170 | **Bloqueado** hasta `layers-integration-gate` estable |

Detalle de puente L4→L5: `docs/product/EPIS2_UI_LAYERS.md`.

---

## Hilo activo recomendado (Q2 2026)

### Fase A — Consolidación visual (casi cerrada)

- [x] MF-UI-SIMPLIFY: scaffold, scroll único, ActionBar única
- [x] MF-RAD-M3: superficies, registry, modo diseño, gates
- [x] MF-CLINICAL-PRODUCTIVITY: paquete, gates, piloto `PatientListGrid`
- [x] Dashboard tabs densos → `EpisRadDashboardTabShell` + grids (work, service, nursing, emergency, icu, specialty, patient)
- [x] `EpisBulkActionMenu` en listas de trabajo / mapa camas UCI
- [x] Acordeones sistemáticos en formularios largos + monitoreo UCI + farmacia/especialidad secundario
- [x] Quality dashboard tab → migración grid completa
- [ ] Command palette Ctrl+K en shell global (Fase B productivity)

### Fase B — Completitud Ola 2 + subagentes dev

- Blueprints: ingreso, ambulatorio, traslado, certificado
- Comandos → formulario mínimo (registry existente)
- Journey: `golden-v2-admission-discharge`
- Adopción `ClinicalCommandPalette` + autocomplete en búsqueda paciente
- Orquestación: `npm run dev:agent:orchestrate` · plan Ollama `npm run dev:agent:ollama`

### Fase C — Ola 3 longitudinal


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
