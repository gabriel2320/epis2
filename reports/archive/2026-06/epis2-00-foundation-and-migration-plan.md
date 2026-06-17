# EPIS2-00 — Fundación y plan de migración

**ID:** EPIS2-00  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Objetivo

Establecer canon, alcance MVP, arquitectura objetivo, mapa de migración desde EPIS, gates, reglas Cursor y roadmap — **sin código productivo ni dependencias**.

---

## Archivos creados

### Raíz

| Archivo | Rol |
|---------|-----|
| `README.md` | Punto de entrada del repo |
| `AGENTS.md` | Instrucciones para agentes Cursor |

### Documentación (`docs/`)

| Archivo |
|---------|
| `PRODUCT_CANON.md` |
| `SCOPE_V1.md` |
| `NON_GOALS.md` |
| `ARCHITECTURE_TARGET.md` |
| `LEGACY_DONOR_MAP.md` |
| `CLINICAL_SAFETY_PRINCIPLES.md` |
| `ROADMAP.md` |
| `QUALITY_GATES.md` |
| `MICROPHASE_TEMPLATE.md` |
| `DECISIONS.md` |

### Reglas Cursor (`.cursor/rules/`)

| Regla |
|-------|
| `00-product-canon.mdc` |
| `10-architecture.mdc` |
| `20-clinical-safety.mdc` |
| `30-database.mdc` |
| `40-command-first.mdc` |
| `45-local-ai.mdc` |
| `50-material-ui.mdc` |
| `60-testing.mdc` |
| `70-documentation.mdc` |

### Reportes

| Archivo |
|---------|
| `reports/archive/2026-06/epis2--.md` (este) |

---

## Decisiones tomadas

| ID | Decisión |
|----|----------|
| D-01 | EPIS2 es repositorio **independiente**; EPIS congelado como `LEGACY_REFERENCE` |
| D-02 | Backend propio Fastify + PostgreSQL (ADR-001); FHIR como frontera posterior |
| D-03 | MVP acotado a 12 capacidades y 6 formularios — ver `SCOPE_V1.md` |
| D-04 | OpenMRS, O3, Carbon, overlays, dashboards → **REJECT** explícito |
| D-05 | Migración **selectiva** por matriz MIGRATE/REWRITE/REFERENCE/REJECT |
| D-06 | No avanzar a EPIS2-01 en esta sesión |
| D-07 | IA en servicio separado; degradación sin Ollama obligatoria |

---

## Gates EPIS2-00 — resultado

| Gate | Estado |
|------|--------|
| 00-A Canon coherente | ✓ |
| 00-B MVP limitado | ✓ |
| 00-C Mapa migración | ✓ |
| 00-D Legacy rechazado | ✓ |
| 00-E Sin código productivo | ✓ |
| 00-F Reglas Cursor | ✓ |

**No existe** `package.json`, `apps/`, ni `node_modules` productivos.

---

## Candidatos a migración (prioridad)

| Prioridad | Elemento | Acción | Origen EPIS |
|-----------|----------|--------|-------------|
| P1 | Command registry + resolver + parser | MIGRATE | `packages/epis-ui/src/command/` |
| P1 | Tests comandos (≥100) | MIGRATE | `packages/epis-ui/test/*Intent*.ts` |
| P1 | Form blueprints (6 MVP) | MIGRATE | `packages/epis-clinical-forms/`, `docs/forms/` |
| P2 | Clinical safety | MIGRATE | `packages/epis-clinical-safety/` |
| P2 | Role policy | MIGRATE | `docs/product/EPIS_ROLE_POLICY_CANON.md` |
| P2 | Microcopy español | REWRITE | `docs/ux/EPIS_MATERIAL_SPANISH_COPY.md` |
| P3 | Fixtures demo | MIGRATE | `packages/epis-clinical-forms/src/fixtures/` |
| P3 | Contratos IA structured | MIGRATE | paquetes `epis-*` con schemas |

---

## Elementos rechazados

- OpenMRS, O3, ESM overlays (`esm-epis-*`)
- Carbon / Soft Carbon shells y CSS
- `epis-openmrs-adapter`, writeback invisible
- Route bridges, SPA navigate acoplado OpenMRS
- Dashboards y KPI home
- Scripts `epis-mf-*` de overlay
- Copia de `node_modules`, distro, ledger microfases como gobierno operativo

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Reintroducir OpenMRS “solo backend” | ADR-001 + NON_GOALS + reglas Cursor |
| Scope creep hospitalario | Gate anti-deriva en `QUALITY_GATES.md` |
| IA alucinando datos clínicos | Schemas + `ai_runs` + sin escritura SoT |
| Copiar deuda EPIS al portar registry | MIGRATE archivo a archivo; eliminar imports legacy |
| Auth demo inseguro en producción | ADR-006 pendiente; revisión humana pre-PHI |
| Fatiga de microfases | Plantilla única EPIS2-NN; no importar ledger EPIS |

---

## Próximo paso exacto

```text
Ejecutar solo EPIS2-01 — Bootstrap del monorepo.

Entregables: apps/web, apps/api, services/local-ai, packages/* esqueleto,
TypeScript strict, lint, test, Docker Compose (Postgres + Ollama), CI,
.env.example, health checks.

Gate: npm run check && npm run test && npm run db:validate

No avanzar a EPIS2-02 en la misma sesión.
```

Prompt sugerido para Cursor:

```text
Ejecuta únicamente EPIS2-01 según docs/ROADMAP.md y docs/ARCHITECTURE_TARGET.md.
No avances a EPIS2-02. Entrega cambios, tests, reporte reports/epis2-01-*.md y commit sugerido.
```

---

## Commit sugerido

```text
docs(epis2-00): foundation, migration plan, and cursor rules

Establish EPIS2 product canon, MVP scope, architecture target, selective
legacy donor map from EPIS, quality gates, roadmap EPIS2-00–11, ADRs, and
Cursor rules. No application code or dependencies (EPIS2-01 next).
```

---

## Verificación de criterios de aceptación (usuario)

| Criterio | ✓ |
|----------|---|
| Visión breve no contradictoria | ✓ `PRODUCT_CANON.md` |
| MVP limitado | ✓ `SCOPE_V1.md` |
| EPIS congelado donante | ✓ `LEGACY_DONOR_MAP.md` |
| OpenMRS/O3/Carbon rechazados | ✓ `NON_GOALS.md` |
| Arquitectura objetivo documentada | ✓ `ARCHITECTURE_TARGET.md` |
| Migración selectiva | ✓ `LEGACY_DONOR_MAP.md` |
| Gates por fase | ✓ `QUALITY_GATES.md` |
| Sin dependencias | ✓ |
| Sin código productivo | ✓ |
| Sin pacientes reales | ✓ |
| No avanzó a EPIS2-01 | ✓ |
