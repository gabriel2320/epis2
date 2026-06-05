# EPIS2 — Auditoría de proyecto

**Fecha:** 2026-06-05 · **Commit:** `da61d4c` · **Remote:** https://github.com/gabriel2320/epis2 (privado)

---

## Resumen ejecutivo

| Área | Veredicto |
|------|-----------|
| Canon de producto / invariantes | **OK** — 12 gates arquitectónicos verdes |
| Calidad técnica local | **OK** — check, test, db:validate |
| Seguridad dependencias | **OK** — `drizzle-orm` ≥ 0.45.2 (2026-06-05) |
| CI GitHub | **OK** — Postgres + migrate + golden journey en pipeline |
| Documentación vs código | **Deriva menor** — README y manifiesto legacy desactualizados |
| Piloto clínico humano | **Pendiente** — checklist en `PILOT_DEMO_CHECKLIST.md` |

**Veredicto global:** repositorio **apto para demo técnica y piloto controlado**, no para producción clínica real sin cerrar seguridad DB, CI completo y signoff humano del journey dorado.

---

## Gates ejecutados (2026-06-05)

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK (lint + typecheck + `architecture:validate`) |
| `npm test` | 172 passed · 10 skipped (182 total) |
| `npm run db:validate` | OK — 18 migraciones |
| `npm run qa:bundle-analyze` | OK (última sesión M3-09) |

### Validadores arquitectónicos (12/12)

`main-product-invariants`, `no-direct-mui-imports`, `single-epis2-theme`, `no-legacy-dependencies`, `single-command-registry`, `single-form-registry`, `command-center-home`, `spanish-visible-copy`, `explicit-permissions`, `ai-write-boundary`, `human-approval-required`, `fhir-export-boundary`.

---

## Cumplimiento de producto

| Invariante clave | Evidencia |
|------------------|-----------|
| Home = Centro de Comando | `/` → redirect; `/comando` canónico; validator `command-center-home` |
| No dashboard como home | Tablero en `/epis2/dashboard` secundario con «Volver al Comando» |
| Un Command Registry | `packages/command-registry` único |
| Un Form Registry | `packages/clinical-forms` único |
| IA no aprueba | `ai-write-boundary`; borrador → aprobación humana |
| PostgreSQL SoT | Drizzle + 18 migraciones; sin OpenMRS en deps |
| UI español | `packages/design-system/src/copy/es.ts` + validator |
| Sin legacy UI | Sin OpenMRS/Carbon en `package.json` ni imports |

**Material 3 Clinical:** M3-00…M3-09 implementados; signoff en `reports/epis2-m3-09-qa-signoff.md`.

---

## Estructura del monorepo

| Capa | Paquetes / apps |
|------|-----------------|
| UI | `apps/web`, `@epis2/epis2-ui`, `@epis2/design-system` |
| Dominio | `@epis2/clinical-domain`, `@epis2/command-registry`, `@epis2/clinical-forms` |
| API | `apps/api` (Fastify) |
| IA local | `services/local-ai` (Ollama) |
| Datos | `database/` (SQL migrations) |
| Interop | `@epis2/fhir-export` (frontera API) |

Fases EPIS2-00…12 completadas según README y reportes en `reports/`.

---

## Tests — cobertura y huecos

| Tipo | Estado |
|------|--------|
| Unit / component | 69 archivos activos |
| Golden journey (spec) | 6 tests — **pasa** |
| Golden journey (API) | **skipped** sin `DATABASE_URL` |
| Integración API (7 suites) | **skipped** sin Postgres en CI local |

**Riesgo:** CI en GitHub no levanta Postgres → integraciones y journey API no se ejecutan en remoto. Solo smoke unitario + arquitectura.

---

## Bundle frontend (M3-09)

| Chunk | gzip | Límite |
|-------|------|--------|
| App entry | ~110.6 KB | — |
| mui-core (+ date pickers) | ~163.9 KB | monitorear |
| mui-x-grid | 98.3 KB | 150 KB ✓ |
| mui-x-charts | 60.7 KB | 120 KB ✓ |
| mui-x-other | 11.9 KB | 100 KB ✓ |
| mui-x-scheduler | 77.7 KB | 200 KB ✓ (solo dev spike) |

Lazy barrels MUI X: OK, sin warnings static+dynamic.

---

## Seguridad y secretos

| Ítem | Estado |
|------|--------|
| `.env` en repo | No — solo `.env.example` |
| PHI real | Prohibido por canon; datos demo sintéticos |
| `npm audit` (prod) | **1 high** — `drizzle-orm` < 0.45.2 (SQL identifier injection GHSA-gpj5-g38j-94v9) |

**Acción recomendada:** planificar upgrade `drizzle-orm` → ≥0.45.2 con prueba de regresión en queries Drizzle.

---

## Legacy / frontera EPIS

- `legacy-import-manifest.json` presente con entradas trazadas.
- Donantes referenciados: EPIS, EPIDOS, EPIONE (paths locales).
- **Deriva:** `nextImplementationPhase: "EPIS2-12"` en manifiesto — debería reflejar post-M3 o V-next del roadmap producto.

---

## Deuda técnica conocida

1. **Scheduler MUI X 9 alpha** — peer deps MUI 7+; stack en MUI 6; solo `/dev/scheduler-spike` (EVALUATE).
2. **Modo oscuro** — activo en Comando; falta revisión UX/contraste en formularios y tablero completo.
3. **mui-core inflado** — date pickers siempre en entry vía `Epis2ThemeProvider`.
4. **README** — no menciona fases MUI-01…10 ni M3; roadmap header dice EPIS2-11 max.
5. **CI** — no incluye `qa:bundle-analyze` ni `quality:golden-journey`; sin servicio Postgres.

---

## CI GitHub

Workflow: `.github/workflows/ci.yml` — `npm ci`, `check`, `test`, `db:validate`.

Push `da61d4c` — **CI verde** (check + test + db:validate). Ampliar pipeline recomendado:

```yaml
- run: npm run qa:bundle-analyze
- services: postgres …
- run: npm run quality:golden-journey
```

---

## Próximos pasos (priorizados)

1. ~~**P0** — Actualizar `drizzle-orm` (CVE alta).~~ ✓ 2026-06-05
2. ~~**P0** — Postgres en CI + `quality:golden-journey` en pipeline.~~ ✓ 2026-06-05
3. **P1** — Piloto humano (`docs/quality/PILOT_DEMO_CHECKLIST.md`) → GO DEMO / PASS WITH FIXES.
4. **P1** — Revisión modo oscuro en shell clínico y tablero.
5. **P2** — Sincronizar README, manifiesto legacy y `M3_ADOPTION_PLAN.md` (fase activa post-M3-09).
6. **P2** — Añadir `qa:bundle-analyze` a CI con fallo si excede presupuesto.
7. **P3** — Decisión Scheduler: alinear MUI 7 o retirar spike.

---

## Frase guía

> Los errores de EPIS no son recuerdos: son gates de EPIS2.

Estado actual: **gates técnicos cumplidos**; siguiente frontera = **piloto humano + hardening CI/seguridad**.
