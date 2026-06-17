# EPIS2 — Auditoría técnica para ingeniero externo

**Versión:** 1.0 · **Fecha:** 2026-06-14  
**Audiencia:** ingeniero de software externo (onboarding, due diligence, contribución acotada)  
**Repositorio:** [gabriel2320/epis2](https://github.com/gabriel2320/epis2)  
**HEAD auditado:** `fdb64e5` · **Rama:** `master` (sync con `origin/master`)  
**Commits totales:** ~274

> **Frase guía del proyecto:** *Los errores de EPIS no son recuerdos: son gates de EPIS2.*

---

## 1. Resumen ejecutivo

EPIS2 es una **aplicación clínica command-first** construida desde cero (no fork de OpenMRS/O3). El flujo canónico es:

```text
Login → Centro de Comando (/comando) → paciente → comando clínico
  → intent + formulario mínimo → borrador (+ IA local opcional)
  → revisión humana → aprobación → registro versionado en PostgreSQL
```

**Decisiones arquitectónicas clave:**

| Decisión | Implicación |
|----------|-------------|
| PostgreSQL = SoT clínico | Nada aprobado vive fuera de la DB |
| Borrador ≠ dato clínico | `clinical_drafts` separado de `clinical_notes` |
| IA asiste, no aprueba | Gates `ai-write-boundary`, `human-approval-required` |
| Un registry por dominio | Command, Forms, Widgets — prohibido duplicar |
| EPIS = donante congelado | Import solo vía `legacy-import-manifest.json` |
| Datos demo sintéticos | No PHI real en dev hasta autorización explícita |

**Madurez actual (jun 2026):** producto demo funcional con CI verde, ~100 quality gates, 36 specs E2E Playwright, 45 migraciones SQL, tres modos MD3, dual chart (electrónico/papel), capa de inteligencia determinística (PROG-DI) cerrada, y programa de endurecimiento IA/RAG en curso (PROG-STRENGTHEN).

---

## 2. Qué es y qué no es

### Es

- SPA React 19 + API Fastify + PostgreSQL 16 + pgvector
- Centro de Comando como home (no dashboard)
- Registro clínico con workflow borrador → aprobación auditada
- IA local vía Ollama (opcional; app funciona sin ella)
- Monorepo npm workspaces con paquetes de dominio desacoplados
- Sistema de desarrollo formal (SDEPIS2: olas · hilos · tramos · microfases)

### No es (v1)

- Hospital information system completo
- OpenMRS, Carbon, O3, overlays legacy
- Auto-aprobación clínica
- Dashboard como pantalla de entrada
- Copia masiva de carpetas desde EPIS (`../Epis`)

Canon: [`docs/PRODUCT_CANON.md`](../docs/PRODUCT_CANON.md) · [`docs/NON_GOALS.md`](../docs/NON_GOALS.md)

---

## 3. Ecosistema de repositorios (tríada)

EPIS2 no opera aislado. Tres repos hermanos con integración **solo por contratos** (JSON/YAML/HTTP):

```text
EPIS2 (producto)          epis2-evolab (simulador)     EPIS2-MedRepo (biblioteca)
     │                              │                            │
     │◄──── HTTP sandbox ───────────┤                            │
     │◄──── findings JSON ──────────┤                            │
     │◄──── knowledge packs ──────────────────────────────────────┤
     └──── clinical-case-intel ────► escenarios YAML
```

| Repo | GitHub | Rol | Estado jun 2026 |
|------|--------|-----|-----------------|
| **EPIS2** | gabriel2320/epis2 | Producto · SoT PostgreSQL | Activo · `master` sync |
| **epis2-evolab** | gabriel2320/epis2-evolab | Simulador · findings | Ahead 1 commit local |
| **EPIS2-MedRepo** | remote pendiente | RAG · Knowledge Packs | Local · sin git remoto |

Doc: [`docs/product/EPIS2_TRIADA_REPOS.md`](../docs/product/EPIS2_TRIADA_REPOS.md)

**Regla para externos:** no importar código entre repos. Usar bridges documentados (`npm run evolab:*`, exports JSON).

---

## 4. Arquitectura del monorepo

### 4.1 Layout

```text
EPIS2/
├── apps/
│   ├── api/          Fastify REST — SoT, auth, clinical, AI proxy
│   └── web/          Vite + React 19 — UI clínica, Centro de Comando
├── packages/
│   ├── contracts/              Zod + tipos compartidos
│   ├── clinical-domain/        Reglas clínicas, RBAC, safety
│   ├── command-registry/       Intents, slots, routing (único registry)
│   ├── clinical-forms/         Blueprints + pantallas generadas (único registry)
│   ├── epis2-ui/               Capa MUI/M3
│   ├── epis2-widgets/          Widget registry contextual
│   ├── clinical-productivity/  Textbox, snippets, spellcheck
│   ├── design-system/          Tokens + copy ES
│   ├── fhir-export/            Export FHIR R4 (frontera API)
│   └── test-fixtures/          Casos demo sintéticos
├── services/
│   ├── local-ai/               Gateway Ollama/OpenAI — assist borradores
│   ├── clinical-case-intel/    CLI casos clínicos sintéticos
│   └── drug-intel/             CLI catálogo farmacológico
├── database/migrations/        45 migraciones SQL incrementales
├── e2e/                        36 specs Playwright
├── scripts/quality/            ~100 gates ejecutables
└── docs/                       Canon L0–L5
```

### 4.2 Stack técnico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Runtime | Node.js | ≥20 <25 (CI: 20) |
| Lenguaje | TypeScript | 5.8 |
| Frontend | React + Vite + TanStack Router | React 19, Vite 6 |
| UI | Material UI 3 (custom theme) | `@epis2/epis2-ui` |
| API | Fastify | 5.3 |
| ORM / SQL | Drizzle + postgres.js | 0.45 / 3.4 |
| DB | PostgreSQL + pgvector | 16 (CI: pgvector image) |
| IA local | Ollama | qwen3:8b default |
| E2E | Playwright + axe | 1.60 |
| Unit | Vitest | 3.2 |
| Observabilidad | OpenTelemetry (opt-in) + Langfuse (opt-in) | MF-NORM-203 / MF-TOOL-06 |

### 4.3 Diagrama de capas runtime (dev local)

```text
┌─────────────────────────────────────────────────────────────┐
│  Browser :5173  apps/web                                    │
│    Centro de Comando · Classic · Dashboard · Dual Chart     │
└───────────────────────────┬─────────────────────────────────┘
                            │ /api proxy
┌───────────────────────────▼─────────────────────────────────┐
│  API :3001  apps/api                                        │
│    JWT session · RBAC · drafts/approve · RLS · audit          │
└───────┬───────────────────────────────┬─────────────────────┘
        │                               │
        ▼                               ▼
┌───────────────┐              ┌─────────────────┐
│ Postgres :5433│              │ local-ai :3002  │
│ epis2_app     │              │ Ollama :11434   │
│ RLS pilot     │              │ Langfuse :3100  │
└───────────────┘              └─────────────────┘
```

Arranque: `npm run stack:dev` · API `npm run dev:api` · Web `npm run dev:web` · IA `npm run dev:ai`

---

## 5. Modelo de datos y seguridad

### 5.1 Tablas nucleares

| Tabla | Rol |
|-------|-----|
| `clinical_drafts` | Borradores en workflow (`draft` → `ready_for_review` → …) |
| `draft_versions` | Historial de versiones por borrador |
| `approvals` | Puente borrador → nota aprobada; FK `ai_run_id` (MF-SH-01) |
| `clinical_notes` | Registro clínico aprobado (SoT post-aprobación) |
| `ai_runs` | Trazabilidad inferencia IA (no es SoT clínico) |
| `audit_events` | Auditoría de acciones |
| `user_operational_memory` | Preferencias operacionales por usuario (PROG-DI) |

**45 migraciones** en `database/migrations/` (001…045). Control: tabla `epis2_schema_migrations`.

### 5.2 Autenticación y autorización

- **Sesión:** JWT HS256 en cookie + Bearer; issuer `epis2-api`
- **Login demo:** usuarios sintéticos + `demoAuthKey`
- **RBAC:** permisos explícitos vía `@epis2/clinical-domain` — sin wildcards
- **RLS PostgreSQL:** piloto en `patients`, `clinical_drafts`, `clinical_notes`, `user_operational_memory`
  - Rol app `epis2_app` con `NOBYPASSRLS`
  - Modo `RLS_MODE=off` en dev/test; `enforce` en staging/prod
- **Headers seguridad HTTP:** middleware en API (auditoría Fase 5)

### 5.3 Invariantes vinculantes (18)

Validados por `npm run architecture:validate`. Violación = bug de arquitectura.

Destacados para externos:

| # | Invariante |
|---|------------|
| 5 | PostgreSQL = SoT — no OpenMRS |
| 9–10 | Un solo Command Registry · un solo Form Registry |
| 11–13 | IA no aprueba · borrador primero · aprobación humana auditada |
| 15 | App funciona sin IA local |
| 18 | No copiar carpetas EPIS sin manifiesto |

Fuente: [`docs/product/PRODUCT_INVARIANTS.md`](../docs/product/PRODUCT_INVARIANTS.md)

---

## 6. Experiencia de usuario (modos)

### 6.1 Tres modos MD3 (EPIS2-PM-01)

| Modo | Ruta canónica | Rol |
|------|---------------|-----|
| **Command** (home) | `/comando` | Centro de Comando — búsqueda + workspace |
| **Classic EMR** | `/espacio/ficha?mode=classic` | Ficha hospitalaria densa |
| **Dashboard MD3** | `/epis2/dashboard?mode=dashboard` | Mi trabajo — secundario |

Gate: `npm run quality:pm01`

### 6.2 Dual chart (ADR-002)

Flag `VITE_ENABLE_DUAL_CHART_MODES` — modos `traditional` | `paper` dentro del workspace de paciente. CI job separado `e2e-dual-chart`.

### 6.3 Inteligencia determinística (PROG-DI — cerrado `f56b7d2`)

Capa **sin Ollama** para UX básica:

| MF | Entrega |
|----|---------|
| DI-01 | Contexto clínico denso (strip + API) |
| DI-02 | Memoria operacional por usuario |
| DI-03 | Autocomplete con ranking de catálogo |
| DI-04 | Prefill contextual CE-6 |
| DI-05 | Acciones probables |
| DI-06 | Sugerencias silenciosas (chips) |
| DI-07 | Plantillas vivas |
| DI-08 | Timeline clínico filtrable |
| DI-09 | Microjourneys post-guardado |
| DI-10 | Signoff journey secretario clínico |

E2E: `e2e/di-clinical-secretary-journey.spec.ts` · Gate: `npm run quality:di-signoff-gate`

---

## 7. IA y asistencia clínica

### 7.1 Arquitectura IA

```text
apps/web ──► apps/api (/api/ai/*) ──► services/local-ai
                                           │
                                    Ollama (local)
                                    OpenAI (opt-in, tier L0)
                                    Langfuse trace (opt-in)
```

- **Modos inferencia:** `ollama` | `openai` | `router` (local first)
- **Tiers de dato:** `L0_synthetic` | `L1_deidentified` | `L2_phi` — cloud bloqueado por tier
- **Provenance:** MF-SH-01 enlaza `approvals.ai_run_id` → `ai_runs`
- **Evals:** `npm run ai:evals`, `ai:evals:live`, `ai:evals:sim` — fixtures en `@epis2/test-fixtures`

### 7.2 Lo que la IA **no** puede hacer

- Aprobar borradores
- Escribir SQL clínico final
- Firmar documentos
- Bypass de `human-approval-required`

Gate: `npm run architecture:validate` → `ai-write-boundary`

### 7.3 Programa en curso: PROG-STRENGTHEN-2026

| Subprograma | Foco | MF activa |
|-------------|------|-----------|
| PROG-CORE-HARDEN | Trazabilidad draft→approve, evals intent | **MF-SH-02** |
| PROG-IA-MODERNIZE | RAG 384d, provenance FHIR, OTel IA | MF-IM-01…09 |
| PROG-CDS-UX | Cards estilo CDS Hooks | MF-CU-01…04 |
| PROG-INTEROP-CHILE | Export MINSAL, SNRE staging | MF-IC-01…04 |

Ledger: `docs/quality/strengthen-ledger.json`

---

## 8. Calidad, CI y gates

### 8.1 Pipeline CI (GitHub Actions)

Archivo: `.github/workflows/ci.yml`

| Job | Contenido |
|-----|-----------|
| **check** | lint · typecheck · architecture:validate · format · openapi · pm01 · layers · theme · vitest · ci-parity · E2E principal · db:validate · ai:evals · golden-journey · bundle-analyze · npm audit |
| **e2e-dual-chart** | dual-chart-gate + `test:e2e:dual-chart` con flag ON |

Postgres CI: `pgvector/pgvector:pg16` · Node 20.

### 8.2 Gates locales obligatorios (cierre sesión)

```bash
npm run check          # lint + typecheck + architecture:validate
npm run test           # vitest
npm run db:validate    # migraciones + schema
```

Journey producto: `npm run quality:golden-journey`

### 8.3 Escala de automatización

| Métrica | Valor |
|---------|-------|
| Scripts `quality:*` | ~100 |
| Specs E2E Playwright | 36 archivos |
| Gates arquitectónicos | 18 en `architecture:validate` |
| Migraciones SQL | 45 |
| Tramos clínicos con E2E | A–K (recepción, UCI, farmacia, etc.) |

### 8.4 Anti-drift

- `legacy-import-manifest.json` — allowlist imports EPIS
- `docs/legacy/EPIS_POSTMORTEM.md` — errores → gates
- `.cursor/rules/*.mdc` — reglas agente IA en Cursor
- Pre-push hook: `npm run check`

---

## 9. Tooling de desarrollo (MF-TOOL-02…06)

Integraciones Cursor/MCP añadidas jun 2026:

| Herramienta | Propósito | Activación |
|-------------|-----------|------------|
| GitHub MCP | PRs, CI, issues | PAT en `.env` |
| Figma MCP | Diseño M3 ↔ código | OAuth / desktop :3845 |
| Context7 MCP | Docs stack actualizadas | npx automático |
| Playwright MCP | Debug E2E desde IDE | `test:e2e:install` |
| Postgres MCP RO | Schema introspection | rol `epis2_mcp_ro` (045) |
| OTel collector | Trazas HTTP dev | `npm run stack:observability` |
| Langfuse | Trazas LLM opt-in | `npm run stack:langfuse` |
| CodeRabbit | Review PRs | `.coderabbit.yaml` |

Doc: [`docs/dev/CURSOR_PLUGINS_EPIS2.md`](../docs/dev/CURSOR_PLUGINS_EPIS2.md)  
Seguridad MCP: [`reports/conciliacion/mcp-safety-review-2026-06-14.md`](./conciliacion/mcp-safety-review-2026-06-14.md)

---

## 10. API — mapa de módulos (referencia rápida)

| Prefijo | Módulo | Archivo base |
|---------|--------|--------------|
| `/api/auth/*` | Login, sesión, audit login | `apps/api/src/auth/` |
| `/api/commands/*` | Resolve intent, suggest | `apps/api/src/commands/` |
| `/api/patients`, `/api/drafts` | Clínica core | `apps/api/src/clinical/` |
| `/api/ai/*` | Status, runs, proxy assist | `apps/api/src/routes/ai/` |
| `/api/dashboard/*` | Tablero MD3 | `apps/api/src/dashboard/` |
| `/api/inpatient/*` | Hospitalización | `apps/api/src/inpatient/` |
| `/api/fhir/*` | Export interoperabilidad | `apps/api/src/fhir/` |
| `/api/admin/*` | Usuarios, catálogos, case-intel | `apps/api/src/admin/` |
| `/api/audit/*` | Eventos auditoría | `apps/api/src/audit/` |
| `/api/interop/*` | Staging HL7/FHIR | `apps/api/src/interop/` |
| `/api/user/*` | Memoria operacional | `apps/api/src/user/` |
| `/api/docs/openapi.json` | OpenAPI | `apps/api/src/openapi/` |

OpenAPI gate: `npm run quality:openapi-gate`

---

## 11. Riesgos y limitaciones (honest assessment)

| Área | Estado | Nota para externo |
|------|--------|-------------------|
| **Producción clínica real** | No desplegado | Solo datos DEMO sintéticos |
| **RLS** | Piloto | `enforce` no universal en todas las tablas |
| **PHI en dev** | Prohibido por canon | MCP/Langfuse con redacción por defecto |
| **MedRepo / Evolab** | Integración parcial | F3–F6 tríada pendiente |
| **Langfuse v2 self-host** | Dev only | v3/ClickHouse diferido |
| **Segfault tsc Windows** | Intermitente | OneDrive path; reintentar `npm run check` |
| **Cobertura E2E** | Alta en journeys clave | No 100% líneas |
| **Documentación** | Extensa (~L0–L5) | Leer canon antes de codear |

---

## 12. Onboarding recomendado (orden de lectura)

### Día 0 — Canon (obligatorio, ~2 h)

1. [`docs/PRODUCT_CANON.md`](../docs/PRODUCT_CANON.md)
2. [`docs/product/PRODUCT_INVARIANTS.md`](../docs/product/PRODUCT_INVARIANTS.md)
3. [`docs/product/EPIS2_DEV_SYSTEM.md`](../docs/product/EPIS2_DEV_SYSTEM.md)
4. [`docs/product/EPIS2_TABLERO.md`](../docs/product/EPIS2_TABLERO.md)
5. [`AGENTS.md`](../AGENTS.md)

### Día 1 — Entorno local (~1 h)

```bash
git clone https://github.com/gabriel2320/epis2.git
cd epis2
cp .env.example .env          # ajustar DATABASE_URL, opcional Ollama
npm ci
npm run stack:dev             # Postgres :5433 + migrate
npm run dev:api               # terminal 1
npm run dev:web               # terminal 2
# opcional: npm run dev:ai
```

Verificar: `http://127.0.0.1:5173/comando` · login demo

### Día 2 — Arquitectura y contribución

1. [`docs/ARCHITECTURE_TARGET.md`](../docs/ARCHITECTURE_TARGET.md)
2. [`docs/quality/GOLDEN_CLINICAL_JOURNEY.md`](../docs/quality/GOLDEN_CLINICAL_JOURNEY.md)
3. [`docs/legacy/EPIS_POSTMORTEM.md`](../docs/legacy/EPIS_POSTMORTEM.md)
4. Declarar alcance SDEPIS2 antes de PR: hilo · tramo · MF-* · archivos permitidos

### Reglas de contribución externa

- **Un objetivo por PR** — no mezclar tramo clínico + refactor UI masivo
- **Gates mínimos:** `npm run check` + tests del área tocada
- **Prohibido:** segundo registry temporal, import EPIS sin manifiesto, dashboard como home
- **Commits:** humano aprueba; no auto-push sin review

---

## 13. Estado al 2026-06-14 y próximos pasos

### Entregado recientemente (commits clave)

| Commit | Entrega |
|--------|---------|
| `fdb64e5` | Cierre correcciones S1 — canon Home, tablero, MCP review |
| `f56b7d2` | PROG-DI MF-DI-01…10 — inteligencia determinística |
| `d349a63` | MF-TOOL-02…06 — MCP, OTel, Langfuse, CodeRabbit |
| `5b92002` | MF-SH-01 — trazabilidad draft→approve→ai_run |

### En curso (tablero vivo)

| Programa | Siguiente paso |
|----------|----------------|
| PROG-CONCILIACION-TRIADA | F3 push epis2-evolab + smoke |
| PROG-STRENGTHEN | MF-SH-02 evals intent top-10 |
| EPIS2-MedRepo | F4 git init + check verde |

### Comandos de verificación rápida

```bash
npm run check
npm run test
npm run db:validate
npm run quality:di-signoff-gate      # PROG-DI
npm run quality:strengthen-next      # siguiente MF STRENGTHEN
npm run cursor:verify                # MCP dev tooling
```

---

## 14. Índice de reportes de auditoría previos

| Reporte | Tema |
|---------|------|
| [`epis2-auditoria-profunda-2026-06-09.md`](./archive/2026-06/epis2-auditoria-profunda-2026-06-09.md) | Auditoría profunda F1–F4 |
| [`epis2-auditoria-inventario-limpieza-2026-06-09.md`](./archive/2026-06/epis2-auditoria-inventario-limpieza-2026-06-09.md) | Inventario + limpieza |
| [`conciliacion/mcp-safety-review-2026-06-14.md`](./conciliacion/mcp-safety-review-2026-06-14.md) | Seguridad MCP |
| [`epis2-prog-di-close-2026.md`](./epis2-prog-di-close-2026.md) | Cierre PROG-DI |

---

## 15. Contacto y enlaces

| Recurso | URL |
|---------|-----|
| Repositorio | https://github.com/gabriel2320/epis2 |
| CI Actions | https://github.com/gabriel2320/epis2/actions |
| Evolab | https://github.com/gabriel2320/epis2-evolab |
| Índice docs | [`docs/INDEX.md`](../docs/INDEX.md) |

---

*Documento generado para onboarding de ingeniero externo. No sustituye el canon de producto ni los invariantes vinculantes. Ante contradicción, prevalece `docs/product/PRODUCT_INVARIANTS.md`.*
