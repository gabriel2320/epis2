# EPIS2 — Módulos truncados y legacy runtime

**Versión:** 1.0 · **Fecha:** 2026-06-16 · **Programa:** PROG-PURGE-CICA · MF-PURGE-03

> Funcionalidad **empezada en master** pero no continuada hasta nuevo aviso. **No borrar** sin MF explícita — archivar documentación y congelar expansión.

**Experiencia activa:** legacy `/espacio/*` · CICA `/app/*` opt-in (`VITE_ENABLE_CICA_UI=true`, NO-GO)  
**Fallback:** legacy `/espacio/*`, classic MD3, three modes

---

## Leyenda

| Estado | Significado |
|--------|-------------|
| **frozen** | Código vivo; sin nuevas features |
| **fallback** | Solo cuando CICA OFF o sin pantalla CICA |
| **scaffold** | UI/demo; sin SoT completo |
| **labs** | Servicio experimental; no import core→ |
| **fossil** | Solo referencia; `migration/candidates/` |

---

## Mapa por zona

### Core producto (keep — intocable)

| Módulo | Acción | Notas |
|--------|--------|-------|
| `apps/api` | keep | SoT HTTP |
| `apps/web/src/cica/` | **activo CICA** | Rutas `/app/*` |
| `packages/contracts` | keep | Contratos Zod |
| `packages/command-registry` | keep | Único registry |
| `packages/clinical-forms` | keep | Único Form Registry |
| `packages/clinical-productivity` | keep | Grillas, acciones |
| `packages/epis2-ui/src/cica/` | **activo CICA** | Shell clean room |
| `packages/ai-client` | keep | Frontera IA |
| `database/migrations` | keep | MF autorizada para cambios |

### Legacy runtime (frozen / fallback)

| Módulo | Estado | Rutas / evidencia | Purga |
|--------|--------|-------------------|-------|
| Censo legacy | fallback | `/espacio/buscar-paciente` | Keep; redirect a CICA si flag ON |
| Ficha dual MD3 | frozen | `/espacio/ficha`, classic chart | Keep secundario |
| Three modes | frozen | `EpisModeSwitcher`, gates `three-modes` | No home; no expandir |
| Command Center | fallback | `/comando` redirect | Compat only |
| Dashboard MD3 | frozen | `/epis2/dashboard` | Secundario; no home |
| Formularios sin CICA | fallback | lab, epicrisis, UCI, farmacia, ingreso… | Keep hasta pantalla CICA |
| Paper planner extendido | scaffold | `paper-planner-*` gates | Needs-review vs Base v0.1 |
| Dual chart (pre-CICA) | frozen | `dual-chart-*` components | Datos OK; composición CICA nueva |

### Tramos clínicos A–K (scaffold / demo)

| Tramo | Estado | Gates | Acción |
|-------|--------|-------|--------|
| A — Recepción | scaffold | `validate-tramo-a-*` | frozen |
| B — Ambulatorio | scaffold | `validate-tramo-b-*` | frozen |
| C — Hospitalización | demo parcial | `validate-tramo-c-*` | frozen |
| D — UCI | scaffold | `validate-tramo-d-*` | frozen |
| E — Quirófano | scaffold | `validate-tramo-e-*` | frozen |
| F–K | scaffold | varios | frozen — inventario gates |

Evidencia histórica: `reports/archive/2026-06/epis2-tramos-*`

### Olas M3 / IDC / TE / PA / NORM (cerrados — archive docs)

| Programa | MF | Estado programa | Acción purga |
|----------|-----|-----------------|--------------|
| Ola M3 ficha | ola1–ola6 | cerrado | Archivar reportes MF; keep código demo |
| TE (tabular engine) | te-01…08 | cerrado | Archivar gates alias |
| PA (paper planner) | pa-01…08 | cerrado | Archivar reportes |
| NORM fullstack | norm-00…11 | cerrado | Archivar reportes |
| Dual chart | dual-chart-00…09 | cerrado | Superseded por CICA ficha |
| Paper mode | paper-01…08 | cerrado parcial | Keep print A5; archive planner extendido |

### Labs (needs-review — no core)

| Servicio | Estado | Acción |
|----------|--------|--------|
| `services/clinical-case-intel` | labs | keep; gate `core-no-labs-imports` |
| `services/drug-intel` | labs | keep; no SoT clínico |
| MedRepo loader | parcial | fixture sintético default |
| Evolab bridge | external | repo hermano HTTP |

### Fósiles (fossil — no runtime)

| Elemento | Ubicación | Acción |
|----------|-----------|--------|
| OpenMRS / O3 / Carbon | `migration/candidates/` | archive — no portar |
| Lyra catalogs export | `migration/candidates/lyra/` | archive |
| EPIS overlay | audit scripts | REFERENCE_ONLY |
| Command Center como home | eliminado | ✓ |
| Copia masiva EPIS | prohibido | manifest obligatorio |

---

## Gates npm históricos

Clasificación en `tools/scripts/classify.mjs`:

- Patrones `quality:tramo|ola|te-|pa-|paper-planner|three-modes|…` → **ARCHIVE**
- Meta-gates humanos: `quality:fast`, `quality:clinical`, `quality:required`, `quality:ui`, `quality:ai`

No eliminar scripts de gate en esta fase — solo archivar aliases del root `package.json` (ya hecho en script diet).

---

## Contratos preservados (no truncados)

```text
API routes clínicas core (patients, drafts, approvals, audit)
Command execute + registry
Form blueprints (evolución, epicrisis, receta, lab)
FHIR export frontera
Auth demo (dev/test) + fail-closed prod
IA degrade (Ollama off = UX completa)
```

---

## Próximo paso (cuando se autorice)

1. MF-PURGE-05 ✓ — `@legacy-runtime` en entrypoints `/espacio/*` + `cicaLegacyRedirects.ts`.
2. Pantallas CICA pendientes: epicrisis, laboratorio, imagenología, UCI (priorizar según golden journey).
3. Matriz tramo A–K fila a fila con estado `demo|scaffold|dead` (hoja ampliación).

---

## Referencias

- [`MODULE_INVENTORY.md`](../MODULE_INVENTORY.md)
- [`EPIS2_PURGE_ARCHIVE_PLAN.md`](../product/EPIS2_PURGE_ARCHIVE_PLAN.md)
- [`reports/epis2-cica-clean-room-redesign-2026-06-17.md`](../../reports/epis2-cica-clean-room-redesign-2026-06-17.md)
