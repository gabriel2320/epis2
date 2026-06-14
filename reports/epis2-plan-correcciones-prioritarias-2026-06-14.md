# EPIS2 — Plan de correcciones prioritarias

**Versión:** 1.0 · **Fecha:** 2026-06-14  
**Base:** conciliación auditoría pública + estado local post-PROG-DI  
**HEAD local:** `f56b7d2` · **ahead origin:** 2 commits  
**Programas relacionados:** PROG-CONCILIACION-TRIADA-2026 · PROG-COMPACTACION-MONOREPO-2026 (nuevo)

> **Norte:** cerrar brecha operativa (git = ledger = tablero) antes de compactar monorepo. No mezclar tríada + refactor IA + UI en la misma sesión.

---

## 1. Diagnóstico en una frase

EPIS2 ya tiene arquitectura y gates suficientes para crecer; lo que frena hoy es **desalineación operativa** (tablero/ledger vs git, tríada incompleta, documentación Home en tres capas) y **complejidad de scripts** sin capa canónica unificada.

---

## 2. Mapa de programas (orden, no paralelo caótico)

```text
BLOQUE A — Operativa inmediata (1–2 sesiones)
  A1 Pre-push + publicar DI
  A2 Tablero/ledger sync
  A3 MCP safety review

BLOQUE B — Tríada (3–5 sesiones)          ← plan existente F3–F7
  B1 Evolab push + sync findings
  B2 MedRepo git + lint
  B3 Smoke tríada + matriz gates
  B4 Integración packs (fase mínima)
  B5 Cierre tablero tríada

BLOQUE C — Canon documental (1 sesión)    ← quick win auditoría
  C1 Home unificada (canon + invariantes + nota ADR-002)

BLOQUE D — Compactación monorepo (4–8 sesiones)  ← post-tríada
  D1 Fronteras + gate imports (warn-first)
  D2 Comandos canónicos quality:fast|full
  D3 CI fast workflow
  D4 Split ai-contracts / ai-client
  D5 AGENT_CONTEXT_MINIMAL + banners históricos
  D6 Auto-dev safety preflight
  D7 build:core vs build:intel

BLOQUE E — Producto (paralelo permitido tras A1)
  E1 MF-SH-02 evals intent top-10
```

**Regla:** no iniciar D hasta B5 ✓. C puede ir entre A1 y B1.

---

## 3. BLOQUE A — Operativa inmediata

### A1 — Pre-push y publicar estado real (P0)

**Problema:** GitHub público refleja estado pre-PROG-DI; auditorías externas evalúan código obsoleto.

| ID | Acción | Evidencia |
|----|--------|-----------|
| A1.1 | Verificar gates locales | `check` · `test` · `db:validate` · `quality:di-signoff-gate` |
| A1.2 | E2E DI dual-chart | `VITE_ENABLE_DUAL_CHART_MODES=true` secretary + dual-chart |
| A1.3 | Push `master` | 2 commits: `d349a63` (MCP) + `f56b7d2` (PROG-DI) |

**Gate A1:** CI verde en GitHub tras push.

---

### A2 — Sincronizar tablero y ledgers (P0 doc ops)

**Problema:** `EPIS2_TABLERO.md` aún dice WIP/gitPending y HEAD `5b92002`.

| Archivo | Corrección |
|---------|------------|
| `docs/product/EPIS2_TABLERO.md` | HEAD `f56b7d2` · PROG-DI CLOSED · F2 ✓ · F3 next |
| `reports/epis2-plan-deterministic-intelligence-2026-06-14.md` | Marcar superseded · 10/10 DONE |
| `reports/epis2-plan-conciliacion-triada-2026-06-14.md` | F2 ✓ · actualizar brechas §1 |
| `docs/INDEX.md` | Enlace a este plan |

**Gate A2:** cero contradicción tablero ↔ `di-ledger.json` ↔ plan tríada.

---

### A3 — Revisión MCP pre-push (P0 seguridad)

**Problema:** commit `d349a63` añade Context7, Playwright MCP y **postgres-readonly**.

| Check | Acción |
|-------|--------|
| `EPIS2_MCP_DATABASE_URL` | Solo demo/synthetic; nunca prod con PHI |
| postgres-readonly | Documentar en `CURSOR_PLUGINS_EPIS2.md`: rol read-only, URL separada |
| Tokens GitHub | Permisos mínimos; no en repo |
| Playwright MCP | Solo contra localhost demo |

**Gate A3:** checklist escrito en `reports/conciliacion/mcp-safety-review-YYYYMMDD.md`.

**Si riesgo alto:** revertir `postgres-readonly` del MCP público antes de push; mantener local opcional.

---

## 4. BLOQUE B — Tríada (continuar plan existente)

Referencia: [`epis2-plan-conciliacion-triada-2026-06-14.md`](./epis2-plan-conciliacion-triada-2026-06-14.md)

### B1 — F3 Evolab (P1)

```bash
# en epis2-evolab
git push origin master   # commit 6b9e40b pendiente

# en EPIS2
npm run evolab:doctor
npm run evolab:sync      # si aplica bridge
```

**Entregable:** findings stale triageados · `evolab-open-findings.json` actualizado.

---

### B2 — F4 MedRepo (P1)

| Paso | Acción |
|------|--------|
| B2.1 | `git init` + `.gitignore` + remote |
| B2.2 | Corregir 8 ESLint errors → `npm run check` verde |
| B2.3 | Baseline commit + `medrepo:doctor` |

---

### B3 — F5 Smoke tríada (P1)

Ejecutar matriz en [`triada-gates-matrix-20260614.md`](./conciliacion/triada-gates-matrix-20260614.md):

- EPIS2: `check` · `test` · `db:validate`
- Evolab: doctor + smoke escenario
- MedRepo: `check`

---

### B4 — F6 Integración mínima (P2)

- Cablear consumo Knowledge Pack (grep vacío hoy) — **solo contrato JSON**, sin import código MedRepo.
- Escenario YAML Evolab ← MedRepo export smoke.

---

### B5 — F7 Cierre tríada (P1)

Reporte `reports/conciliacion/triada-close-YYYYMMDD.md` + tablero actualizado.

**Gate B5:** tres repos con git · gates verdes por rol · un solo siguiente paso en tablero.

---

## 5. BLOQUE C — Canon Home (P1 doc, no UI)

**Problema real:** tres capas (Canon, Invariantes #6, ADR-002) — no bug de routing (`command-center-home` OK).

### C1 — MF-CANON-01 (1 sesión, solo docs)

**Archivos permitidos:**

```txt
docs/PRODUCT_CANON.md
docs/product/PRODUCT_INVARIANTS.md
docs/adr/ADR-002-dual-chart-modes.md  (nota de transición §Consecuencias)
```

**Texto unificado:**

```txt
Home canónica = Centro de Comando (/comando)
Estado inicial = búsqueda/censo paciente
Tras selección = workspace ficha dual (traditional | paper)
Dashboard = secundario, nunca home
Transición ADR-002 fase 3 = enmienda formal sin cambiar gates hasta signoff
```

**Gate C1:** `architecture:validate` OK · sin cambios en `apps/web`.

---

## 6. BLOQUE D — Compactación monorepo (post-tríada)

Programa nuevo: **PROG-COMPACTACION-MONOREPO-2026**. Síntesis auditoría externa + gaps locales.

### D1 — Fronteras monorepo (P1)

| Entregable | Descripción |
|------------|-------------|
| `docs/architecture/MONOREPO_BOUNDARIES.md` | Reglas apps/packages/services |
| `scripts/quality/validate-monorepo-boundaries-gate.mjs` | Modo **warn-first** 2 semanas |
| `quality:monorepo-boundaries` | Script raíz |

**Bloqueos objetivo (fase 2):**

- `apps/web` → `services/*/server`
- `clinical-domain` → React
- `@mui/*` directo en apps/web (ya parcial vía `no-direct-mui-imports`)

---

### D2 — Comandos canónicos (P1)

Alias sobre infra existente — **no duplicar lógica**:

| Comando nuevo | Implementación inicial |
|---------------|------------------------|
| `quality:fast` | `check` |
| `quality:full` | `quality:local-ci` |
| `quality:clinical` | gates DI + strengthen del rol |
| `quality:ui` | theme + ui-density + layers |
| `agent:doctor` | `dev:velocity` + stack smoke |

Documentar en `EPIS2_DEV_VELOCITY.md` como **única tabla de referencia agente**.

---

### D3 — CI fast (P1)

Nuevo `.github/workflows/ci-fast.yml`:

```yaml
# push + PR: lint, typecheck, architecture:validate, test unitario
# Sin: playwright, ai:evals, golden-journey, bundle-analyze
```

CI principal (`ci.yml`) permanece como **ci-full**.

---

### D4 — Frontera IA local (P1 refactor)

**Estado actual:** `apps/web` importa `@epis2/local-ai/commandAssistDraft` y `contextPanelSuggestions`.

**Target conservador:**

```txt
packages/ai-contracts   ← Zod/DTOs compartidos
packages/ai-client        ← HTTP + helpers UI sin Fastify
services/local-ai         ← solo servidor + re-export temporal deprecado
```

**Migración:** 3 archivos web + tests · gate `ai-write-boundary` intacto.

**No hacer:** renombrar servicio en docker/stack en la misma MF.

---

### D5 — Contexto agente + docs (P2)

| Entregable | Contenido |
|------------|-----------|
| `docs/AGENT_CONTEXT_MINIMAL.md` | 8 secciones L0 (Home, stack, imports, gates mínimos, PHI cero) |
| Banner histórico | Template `> Estado: HISTÓRICO` en `reports/` antiguos |
| `AGENTS.md` | Puntero: leer MINIMAL primero |

---

### D6 — Auto-dev safety (P2)

`scripts/dev-agent/safety-preflight.mjs`:

- Bloquear rama `main`/`master` en modo `--apply`
- Push desactivado por defecto
- Warning si `.env` expuesto en diff
- Integrar en `dev:agent:ollama-auto --apply`

---

### D7 — Build core vs intel (P2)

```json
"build:core": "… sin drug-intel, clinical-case-intel …",
"build:intel": "… solo services intel …",
"build": "build:core && build:intel"
```

Objetivo: loop UI no reconstruye pipelines pesados.

---

## 7. BLOQUE E — Producto (tras A1)

### E1 — MF-SH-02 (READY en strengthen-ledger)

**Objetivo:** evals intent top-10 · gate `ai:evals:live`  
**Bloqueo previo:** resuelto con commit PROG-DI  
**Alcance:** packages evals + scripts — no tocar UI ficha

---

## 8. Matriz de prioridades consolidada

| Pri | ID | Problema | Sesiones | Bloque |
|-----|-----|----------|----------|--------|
| **P0** | A1 | GitHub desactualizado | 0.5 | A |
| **P0** | A2 | Tablero/ledger stale | 0.5 | A |
| **P0** | A3 | MCP postgres-readonly | 0.5 | A |
| **P1** | B1–B5 | Tríada incompleta | 3–5 | B |
| **P1** | C1 | Home canon 3 capas | 1 | C |
| **P1** | D1–D3 | Monorepo ops + CI fast | 2–3 | D |
| **P1** | D4 | Split local-ai | 2 | D |
| **P2** | D5–D7 | Docs agente + build intel | 2–3 | D |
| **P2** | E1 | MF-SH-02 | 1–2 | E |

---

## 9. Qué NO corregir ahora (explícito)

| Item auditoría | Motivo posponer |
|----------------|-----------------|
| Segundo registry / más módulos clínicos | PROG-DI recién cerrado |
| Migración `scripts/` → `tools/` | Cosmético; alto churn |
| Langfuse/Sentry MCP | Ya parcial en d349a63; evaluar post A3 |
| Consumo MedRepo en CDS | F6 tríada, no antes |
| Enmienda ADR-002 routing censo-first | Requiere signoff producto + E2E; no solo docs |

---

## 10. Calendario sugerido (8–10 sesiones)

| Sesión | Bloque | Entregable |
|--------|--------|------------|
| **S1** | A1 + A3 | Push + MCP review |
| **S2** | A2 + C1 | Tablero sync + canon Home |
| **S3** | B1 | Evolab push + findings |
| **S4** | B2 | MedRepo git + lint |
| **S5** | B3 + B5 | Smoke tríada + cierre |
| **S6** | E1 | MF-SH-02 |
| **S7** | D1 + D2 | Boundaries + comandos |
| **S8** | D3 | ci-fast.yml |
| **S9–S10** | D4 | ai-client split |

---

## 11. Gates de cierre por bloque

```bash
# A — operativa
npm run check && npm run test && npm run db:validate
git push origin master  # tras aprobación humana

# B — tríada
npm run evolab:doctor
# MedRepo: npm run check
# reporte triada-close

# C — canon
npm run architecture:validate

# D — compactación
npm run quality:monorepo-boundaries  # cuando exista
npm run quality:fast
# CI fast verde en PR

# E — strengthen
npm run ai:evals:live
npm run quality:strengthen-next
```

---

## 12. Próximo paso exacto (una acción)

```text
Sesión S1: A3 ✓ → C1 ✓ → A2 ✓ → A1 push master (aprobación humana)
```

**S1 progreso 2026-06-14:** A3 MCP review · A2 tablero/INDEX/conciliación · C1 canon Home — commit docs pendiente.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
