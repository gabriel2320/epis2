# EPIS2 — Plan de purga, depuración y archivo (PROG-PURGE-CICA)

**Versión:** 1.0 · **Fecha:** 2026-06-16  
**Programa:** `PROG-PURGE-CICA` · **Congelamiento:** vigente ([`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md))

> **Tesis:** El producto activo es **CICA + contratos full stack**; todo lo demás se **archiva** (mover, no borrar) hasta nuevo aviso.

**Brújula:** [`EPIS2_CURRENT_STATE.md`](../EPIS2_CURRENT_STATE.md) · **Inventario:** [`MODULE_INVENTORY.md`](../MODULE_INVENTORY.md)

---

## 1. Objetivo

Reducir ruido operativo del monorepo sin romper:

| Intocable | Evidencia |
|-----------|-----------|
| Contratos Zod/API | `@epis2/contracts` |
| Command + Form Registry | `@epis2/command-registry`, `@epis2/clinical-forms` |
| Golden journey | `docs/quality/GOLDEN_CLINICAL_JOURNEY.md` |
| PostgreSQL SoT + borrador→aprobación | invariantes |
| Experiencia visual **CICA** | `packages/epis2-ui/src/cica/`, `apps/web/src/cica/` |
| Legacy como fallback | `/espacio/*` con `VITE_ENABLE_CICA_UI=false` |

**No es objetivo:** borrar código referenciado, renombrar packages masivo, ni mega-PR mezclando auth + movimiento de carpetas.

---

## 2. Cuatro zonas post-purga

```text
┌─────────────────────────────────────────────────────────────┐
│ ACTIVO — flujo de trabajo actual                            │
│ apps/web(cica) · apps/api · packages/* · database/          │
│ services/local-ai · @epis2/ai-client                        │
│ docs canon + ledgers MF abiertos                            │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ LABS — vivo pero no core                                    │
│ services/clinical-case-intel · services/drug-intel          │
│ repos hermanos Evolab / MedRepo                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ LEGACY RUNTIME — fallback, no expandir                      │
│ /espacio/* · three modes · classic MD3 · tramos A–K demo    │
│ migration/candidates/ (fósiles EPIS)                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ARCHIVO — solo lectura                                      │
│ reports/archive/ · docs/archive/ · ramas git archivadas     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Secuencia de microfases (orden obligatorio)

| MF | Entrega | Allowlist | Gate |
|----|---------|-----------|------|
| **MF-PURGE-00** | Este plan + inventarios | `docs/product/`, `docs/archive/` | `quality:fast` |
| **MF-PURGE-01** | Lote 6 reportes → `reports/archive/2026-06/` | `reports/`, script mantenimiento | `quality:fast` |
| **MF-PURGE-02** | Registro ramas git archivadas | `docs/archive/BRANCH_REGISTRY.md` | doc |
| **MF-PURGE-03** | Matriz módulos truncados | `docs/archive/TRUNCATED_MODULES.md` | doc |
| **MF-PURGE-04** | Punteros canon (CURRENT_STATE, INDEX) | docs brújula | `quality:fast` |
| **MF-PURGE-05** | *(Opcional)* Etiquetar rutas legacy `/espacio` en código | `apps/web` comentarios `@legacy` | `quality:clinical` |
| **MF-PURGE-07** | Perímetro agentes + `.cursorignore` | `docs/archive/`, `.cursor/rules/` | `quality:fast` |

**Un PR por MF.** No ejecutar MF-PURGE-05 y MF-PURGE-01 en el mismo merge.

---

## 4. Criterios de archivo

### 4.1 Reportes (`reports/`)

**Permanecen en raíz:**

- Generados de sesión: `dev-agent-brief.md`, `dev-agent-prompt-*.md` (activos), `dev-agent-session.md`
- Cierres de programa recientes (`epis2-prog-*-close*.md`)
- Situación actual y auditoría post-rc3 vigente
- Evidencia **CICA / aesthetic reset** activa (`epis2-cica-*`, `epis2-pr-aest-*`, `reports/cica-l/`)
- Cierres UX-LAB rc3/rc4 (2026-06-16+)
- `README.md`, `INDEX.md`

**Mover a `reports/archive/YYYY-MM/`:**

- MF individuales de programas **cerrados** (STRENGTHEN, tramos A–K, olas M3, NORM, paper, dual-chart, MUI theme, layout v1–v5)
- Auditorías duplicadas o superseded por brújula
- Briefs tramo (`dev-agent-prompt-tramo-*.md`) de programas cerrados
- Planes v1–v5 históricos

Regla: **mover, no borrar.** Actualizar punteros en [`reports/archive/2026-06/README.md`](../../reports/archive/2026-06/README.md).

### 4.2 Ramas git

Ver [`docs/archive/BRANCH_REGISTRY.md`](../archive/BRANCH_REGISTRY.md).

- Ramas mergeadas → **registrar** en BRANCH_REGISTRY + tag `archive/<rama>-YYYY-MM-DD` opcional
- **No borrar** ramas locales/remotas salvo orden explícita del operador
- Rama activa: `master` + feature CICA en curso si aplica

### 4.5 Alcance agentes (MF-PURGE-07)

Ver [`docs/archive/AGENT_SCOPE_EXCLUSIONS.md`](../archive/AGENT_SCOPE_EXCLUSIONS.md).

- `.cursorignore` excluye `reports/archive/` del índice Cursor
- Regla Cursor: `.cursor/rules/05-agent-archive-boundary.mdc`
- Subagentes archivados no se regeneran en `dev:session` por defecto
- Reabrir camino archivado solo con MF + `EPIS2_ALLOW_ARCHIVED_SCOPE=1`

### 4.3 Código truncado

Ver [`docs/archive/TRUNCATED_MODULES.md`](../archive/TRUNCATED_MODULES.md).

- **No eliminar** rutas `/espacio/*`, scaffolds tramo, three modes — son fallback y demo
- Marcar `@legacy` / `// TRUNCATED` en nuevas ediciones
- Gates históricos: ya clasificados `ARCHIVE` en `tools/scripts/classify.mjs`

### 4.4 Documentación

- Planes superseded → `docs/archive/` (ya iniciado con `PHASE_HISTORY.md`)
- **No** archivar: `PRODUCT_CANON.md`, `PRODUCT_INVARIANTS.md`, `GOLDEN_CLINICAL_JOURNEY.md`, `EPIS2_UX_LAB_MODERN_PLAN.md`, ledgers JSON abiertos

---

## 5. Experiencia CICA (línea visual activa)

| Elemento | Ubicación | Estado |
|----------|-----------|--------|
| Tokens + shell | `packages/epis2-ui/src/cica/` | **Activo** |
| Rutas `/app/*` | `apps/web/src/cica/` | **Activo** |
| Flag | `VITE_ENABLE_CICA_UI=true` (opt-in lab) | **Legacy activo** por defecto |
| Redirects legacy→CICA | `apps/web/src/cica/legacyRedirects.ts` | **Activo** |
| Epicrisis, lab, UCI, farmacia | solo `/espacio/*` | **Legacy fallback** |

Principio clean room ([`epis2-cica-clean-room-redesign-2026-06-17.md`](../../reports/epis2-cica-clean-room-redesign-2026-06-17.md)):

> El legacy dona **datos y contratos**; **no** dona composición visual.

---

## 6. Contratos full stack preservados

```text
@epis2/contracts          ← Zod compartido
@epis2/command-registry   ← único Command Registry
@epis2/clinical-forms     ← único Form Registry
@epis2/clinical-domain    ← CDS demo
@epis2/clinical-productivity
@epis2/ai-client          ← frontera IA (web → API → local-ai)
@epis2/fhir-export        ← interop
database/migrations       ← SoT PostgreSQL
```

Ningún paso de purga debe romper `npm run check`, golden journey ni `architecture:validate`.

---

## 7. Gates de cierre por tramo

| Tramo | Gate mínimo |
|-------|-------------|
| Docs + archivado reportes | `npm run quality:fast` |
| Toca rutas web/API | `npm run quality:clinical` |
| Pre-merge programa completo | `npm run quality:required` |

---

## 8. Prompt maestro (agentes)

```text
PROG-PURGE-CICA — consolidación visual CICA, no expansión clínica.

Antes de editar:
1. Leer EPIS2_PURGE_ARCHIVE_PLAN.md + TRUNCATED_MODULES.md
2. Declarar MF-PURGE-* · allowlist · prohibidos
3. Mover a archive/, nunca borrar evidencia
4. Preservar CICA /app/*, contratos, golden journey
5. No eliminar código /espacio/* sin MF-PURGE-05 explícita

Éxito: reports/ raíz <80 archivos activos; brújula actualizada; CI verde.
```

---

## Referencias

| Doc | Uso |
|-----|-----|
| [`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md) | Qué está prohibido |
| [`BRANCH_REGISTRY.md`](../archive/BRANCH_REGISTRY.md) | Ramas archivadas |
| [`TRUNCATED_MODULES.md`](../archive/TRUNCATED_MODULES.md) | Código a medias |
| [`reports/archive/2026-06/README.md`](../../reports/archive/2026-06/README.md) | Lotes reportes |
