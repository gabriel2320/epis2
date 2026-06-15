# EPIS2 — Plan consolidación ola 2 (gobierno + hardening)

**Versión:** 1.0 · **Fecha:** 2026-06-15 · **Programa:** PROG-CONSOLIDATE-2  
**Predecesor:** ola 1 cerrada · [`epis2-prog-consolidate-close-2026.md`](../../reports/epis2-prog-consolidate-close-2026.md) · PR [#6](https://github.com/gabriel2320/epis2/pull/6)

Congelamiento: [`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md)

---

## Principio operativo

**Un PR pequeño por objetivo.** No ejecutar los 11 tramos en un solo merge.

Rama sugerida tras merge ola 1:

```bash
git checkout master && git pull
git checkout -b chore/epis2-consolidation-2
```

Cada tramo = commit(s) enfocados + PR a `master` + reporte breve en `reports/` si cierra MF-CON-*.

---

## Mapa: plan genérico → EPIS2 real

| Tramo genérico | Estado ola 1 | EPIS2 ola 2 (este doc) |
|----------------|--------------|-------------------------|
| Limpiar `package.json` | ✓ Fases 0–4 | Mantener; no re-expandir root |
| `CURRENT_STATE.md` | ✓ `EPIS2_CURRENT_STATE.md` | + `CONSOLIDATION_FREEZE.md` |
| Carpetas `labs/` físicas | ✗ no aplica | **Zonas lógicas** — ver [`MONOREPO_GOVERNANCE.md`](../MONOREPO_GOVERNANCE.md) |
| Evolab en repo | ✗ | Repo hermano `../epis2-evolab` — [`EPIS2_TRIADA_REPOS.md`](EPIS2_TRIADA_REPOS.md) |
| `ai-contracts` nuevo package | ◐ | **`@epis2/ai-client`** ya cumple frontera; web sin `local-ai` ✓ |
| CI required/nightly | ◐ manifiestos | Split workflows (tramo 11) |

---

## Cuatro zonas (sin reestructura masiva aún)

| Zona | Rutas EPIS2 | Regla |
|------|-------------|--------|
| **Core** | `apps/web`, `apps/api`, `packages/*` (contratos, forms, registry, UI), `database/` | Producto; congelar features |
| **Labs in-repo** | `services/clinical-case-intel`, `services/drug-intel` | No import desde core UI; API vía contratos |
| **Tools** | `tools/`, `scripts/`, `.github/`, `.cursor/` | Gates, agentes, CI |
| **Archive** | `reports/archive/` (objetivo), docs legacy | Solo lectura operativa |

**No debe ocurrir:** `apps/web` → `services/local-ai` directo · core → `../Epis` sin manifest.

**Sí puede ocurrir:** Evolab/MedRepo por HTTP · `tools/gates` inspecciona packages · labs generan fixtures sintéticos.

---

## Secuencia de PRs (orden EPIS2)

| PR | ID SDEPIS2 | Entrega | Allowlist típica | Gate cierre |
|----|------------|---------|------------------|-------------|
| **001** | MF-CON-01 | Ola 1 scripts + gates | `tools/gates/*`, root shims | `tool:consolidate:verify-phase4` |
| **002** | MF-CON-02 | Freeze + gobierno docs | `docs/CONSOLIDATION_*`, `MONOREPO_GOVERNANCE.md` | `quality:fast` |
| **004** | MF-CON-04 | Config `NODE_ENV`/`AUTH_MODE`/`RLS_MODE` | `apps/api/src/config*`, `.env*.example` | `config.test.ts` + `check` |
| **005** | MF-CON-05 | Killswitch demo auth | `apps/api/src/auth/*`, `clinical-domain/demoUsers` | tests auth + `check` |
| **006** | MF-CON-06 | Baseline HTTP (CSP, cookies, CORS) | `apps/api/src/server*`, plugins seguridad | tests headers |
| **007** | MF-CON-07 | Rate limit Redis/Valkey | `apps/api` store interface | env guard staging/prod |
| **003** | MF-CON-03 | Gobierno monorepo (gates, no mv masivo) | `scripts/architecture/*`, `reports/archive/` | `architecture:validate` |
| **009** | MF-CON-09 | Fixtures fuera de prod deps | `apps/api`, `test-fixtures`, case-intel | `db:validate` + case-intel gates |
| **010** | MF-CON-10 | LICENSE, SECURITY, DISCLAIMER | raíz repo + `docs/` | revisión legal humana |
| **011** | MF-CON-11 | CI `required` / `nightly` / `experimental` | `.github/workflows/*`, `tools/gates/*.json` | CI verde |
| **008** | — | *(Opcional doc)* | Confirmar `quality:web-ai-boundary-gate` | ya cerrado FICHA-FIRST |

**No mezclar:** 004+005 (auth) con 006 (HTTP) · 003 (gobierno) con 004 (config) · 011 (CI) con lógica clínica.

---

## Tramo 004 — Config (estado actual → objetivo)

**Hoy** (`apps/api/src/config.ts`):

- `NODE_ENV`: `development` \| `test` \| `production` (falta `staging`)
- `AUTH_MODE`: `demo` \| `hybrid` (falta `production`)
- `RLS_MODE`: fail-closed solo si `NODE_ENV=production`

**Objetivo:**

```text
staging|production → RLS_MODE=enforce obligatorio
production → AUTH_MODE=production obligatorio
staging|production → SESSION_SECRET sin default dev
```

**DoD:** `.env.example`, `.env.staging.example`, `.env.production.example` parsean · tests en `config.test.ts`.

---

## Tramo 005 — Demo auth killswitch

**Hoy:** `findSyntheticUser` / `verifyDemoAuthKey` en `apps/api/src/auth/routes.ts` sin guard de entorno.

**Regla EPIS2:**

```text
development|test → demo permitido
staging|production → demo prohibido; error claro si no hay proveedor real
```

Futuro: `AuthProvider` (Demo / Hybrid / Production) — PR aparte si crece scope.

---

## Tramo 006–007 — HTTP + rate limit

Prioridad tras auth. Endpoints sensibles: login, refresh, `/api/ai/*`, documentos, clínico.

```text
dev/test → MemoryRateLimitStore
staging/production → RedisRateLimitStore + REDIS_URL obligatorio
```

---

## Tramo 009 — `@epis2/test-fixtures`

Deuda conocida: API y case-intel usan fixtures en runtime (seeds SIM).

Opciones EPIS2 (elegir una por PR):

- **A** — `devDependencies` + import dinámico solo dev/test
- **B** — split `packages/demo-fixtures` vs `test-fixtures`
- **C** — build chain CI (ya: contracts → command-registry → test-fixtures)

**Regla:** production no importa fixtures ni crea pacientes demo.

---

## Tramo 010 — Legal / público

Crear en raíz (revisión humana obligatoria):

```text
LICENSE
SECURITY.md
DISCLAIMER.md
CONTRIBUTING.md
```

Contenido mínimo DISCLAIMER: no uso clínico real · no PHI · datos sintéticos · no decisiones clínicas.

---

## Tramo 011 — CI dividido

Usar manifiestos existentes:

```text
.github/workflows/ci-required.yml   ← tools/gates/required.json
.github/workflows/ci-nightly.yml    ← tools/gates/nightly.json
.github/workflows/ci-experimental.yml ← tools/gates/experimental.json
```

Mantener shims root (`db:migrate`, `test:e2e`) hasta migrar callers.

---

## Gates humanos (recordatorio)

| Cuándo | Comando |
|--------|---------|
| Iteración agente | `npm run quality:fast` |
| MF consolidación | `npm run quality:clinical` |
| Pre-merge tramo | `npm run quality:required` |
| Paridad CI local | `npm run quality:nightly` |
| Gate histórico | `npm run quality:gate -- quality:<name>` |

---

## Prompt maestro (Cursor / agentes)

```text
Estamos en PROG-CONSOLIDATE-2 (ola 2). No expansión clínica.

Antes de editar:
1. Leer docs/CONSOLIDATION_FREEZE.md y docs/EPIS2_CURRENT_STATE.md
2. Declarar MF-CON-* · allowlist · prohibidos · gate · riesgo
3. Un PR = un tramo de EPIS2_CONSOLIDATION_PHASE2_PLAN.md

Reglas:
- No features clínicas · no modos UI · no agentes IA producto nuevos
- Cambio funcional solo si seguridad/config lo exige
- No mega-PR · no renombrar packages masivo · no carpeta labs/ física para Evolab
- Tras editar: quality:fast (docs) o quality:clinical (api/config)

Éxito: core no depende de labs/tools; production no arranca en demo; CI required acotado.
```

---

## Referencias

| Doc | Uso |
|-----|-----|
| [`EPIS2_CURRENT_STATE.md`](../EPIS2_CURRENT_STATE.md) | Brújula |
| [`MODULE_INVENTORY.md`](../MODULE_INVENTORY.md) | Inventario |
| [`MAINTENANCE_PACKAGE_SCRIPTS.md`](../MAINTENANCE_PACKAGE_SCRIPTS.md) | Scripts npm |
| [`MONOREPO_GOVERNANCE.md`](../MONOREPO_GOVERNANCE.md) | Zonas y fronteras |
| [`RLS_STAGING_RUNBOOK.md`](../ops/RLS_STAGING_RUNBOOK.md) | RLS |
| [`PRODUCT_INVARIANTS.md`](PRODUCT_INVARIANTS.md) | Invariantes |
