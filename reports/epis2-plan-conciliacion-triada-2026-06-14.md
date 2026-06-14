# EPIS2 — Plan de fases: conciliación tríada (producto · simulador · repositorio)

**Versión:** 1.0 · **Fecha:** 2026-06-14  
**Programa:** `PROG-CONCILIACION-TRIADA-2026`  
**Alcance:** EPIS2 · epis2-evolab · EPIS2-MedRepo  
**Sistema:** [SDEPIS2](../docs/product/EPIS2_DEV_SYSTEM.md) · **Auditoría base:** conversación 2026-06-14

> **Norte:** una sola verdad operativa por repo (git = ledger = gates). Integración solo por contratos exportados; nunca import cruzado de código clínico.

---

## 1. Diagnóstico resumido (brechas a cerrar)

| Brecha | Repo | Evidencia | Severidad |
|--------|------|-----------|-----------|
| PROG-DI cerrado en ledger, commit local | EPIS2 | `di-ledger.json` CLOSED · `f56b7d2` · push pendiente A1 | **P0** → push |
| Plan DI desactualizado (0/10) vs ledger (10/10) | EPIS2 | `epis2-plan-deterministic-intelligence-2026-06-14.md` | P1 |
| Tablero no refleja WIP DI ni estado post-signoff | EPIS2 | `EPIS2_TABLERO.md` | P1 |
| Findings Evolab stale | EPIS2 ↔ Evolab | `evolab-open-findings.json` sync 2026-06-11 | P1 |
| Commit F5 sin push | Evolab | `master` ahead 1 (`6b9e40b`) | P1 |
| 24 hallazgos open sin triage → backlog | Evolab → EPIS2 | 15 high · 7 medium | P2 |
| Sin control de versiones | MedRepo | no `.git` | P1 |
| `npm run check` rojo | MedRepo | 8 ESLint errors | P2 |
| Consumo Knowledge Pack no cableado en EPIS2 | MedRepo → EPIS2 | grep vacío en monorepo clínico | P3 |
| MedRepo MF-017b pendiente | MedRepo | `DEVELOPMENT_PHASES.md` | P3 |

---

## 2. Mapa de repos y contratos de integración

```text
┌─────────────────────────────────────────────────────────────────┐
│ EPIS2 (producto)          master @ 5b92002 + WIP PROG-DI        │
│  SoT clínico · gates · E2E · bridge evolab:*                    │
└───────────────┬───────────────────────────────┬───────────────────┘
                │ HTTP sandbox                  │ knowledge-pack-*.json
                ▼                               ▼
┌───────────────────────────┐     ┌───────────────────────────────┐
│ epis2-evolab (simulador)  │     │ EPIS2-MedRepo (repositorio)   │
│  master ahead 1           │     │  sin git · check rojo         │
│  scenarios YAML · findings│◄────│  epis2-export · evolab-export│
└───────────────────────────┘     └───────────────────────────────┘
```

| Contrato | Productor | Consumidor | Artefacto |
|----------|-----------|------------|-----------|
| Escenario YAML | clinical-case-intel / MedRepo | epis2-evolab | `scenarios/*.yaml` |
| Findings | epis2-evolab | EPIS2 backlog | `reports/evolab-open-findings.json` |
| Knowledge Pack | MedRepo | EPIS2 (futuro CDS) | `exports/epis2/knowledge-pack-*.json` |
| Dev registration | epis2-evolab F5 | EPIS2 planificación | `epis2-dev-registration.jsonl` |
| Bridge CLI | EPIS2 | epis2-evolab | `npm run evolab:*` |

**Prohibido:** copiar código entre repos · segundo registry · MedRepo como SoT clínico.

---

## 3. Fases del plan (7 fases · 8–12 sesiones)

```text
F0 Inventario ──► F1 Conciliar docs ──► F2 EPIS2 commit/push
                                              │
F3 Evolab push/sync ◄─────────────────────────┤
       │                                      │
       ▼                                      ▼
F4 MedRepo VCS + check              F5 Gates tríada verdes
       │                                      │
       └──────────────► F6 Integración packs ──► F7 Cierre + tablero
```

---

## F0 — Inventario y snapshot (1 sesión · ~45 min)

**Objetivo:** baseline reproducible antes de tocar git.

### Entregables

| ID | Artefacto | Comando / acción |
|----|-----------|------------------|
| F0.1 | Manifest EPIS2 WIP | `git status -sb` + `git diff --stat` → `reports/conciliacion/epis2-wip-manifest-YYYYMMDD.txt` |
| F0.2 | Mapa archivos por MF-DI | Agrupar untracked/modified por MF (01…10) usando `di-ledger.json` `allowedPaths` |
| F0.3 | Snapshot Evolab | `git log -3 --oneline` · diff vs `origin/master` |
| F0.4 | Snapshot MedRepo | `dir` raíz · versión Node · resultado `npm run check` (capturar errores) |
| F0.5 | Matriz gates | Tabla: qué gate corre en cada repo |

### Gate F0

```bash
# EPIS2
mkdir -p reports/conciliacion
git status -sb > reports/conciliacion/epis2-wip-manifest-$(date +%Y%m%d).txt
git diff --stat >> reports/conciliacion/epis2-wip-manifest-$(date +%Y%m%d).txt

# Evolab (desde EPIS2)
npm run evolab:doctor

# MedRepo
cd ../EPIS2-MedRepo && npm run medrepo:doctor
```

**Criterio:** manifest escrito · doctor Evolab OK (o skip documentado con `EPIS2_EVOLAB_OPTIONAL=1`).

---

## F1 — Conciliar documentación (1 sesión · ~60 min)

**Objetivo:** ledger, tablero y reportes dicen lo mismo que el working tree.

### Acciones

| ID | Archivo | Cambio |
|----|---------|--------|
| F1.1 | `reports/epis2-plan-deterministic-intelligence-2026-06-14.md` | Actualizar progreso **10/10 DONE** · marcar como superseded by close report |
| F1.2 | `docs/product/EPIS2_TABLERO.md` | Entrada **PROG-DI** cerrado pendiente commit · PROG-STRENGTHEN MF-SH-02 activo |
| F1.3 | `docs/quality/di-ledger.json` | Verificar fechas; añadir nota `"gitPending": true` en metadata hasta F2 |
| F1.4 | `reports/epis2-prog-di-close-2026.md` | Añadir sección **Pre-commit checklist** |
| F1.5 | Nuevo | `docs/product/EPIS2_TRIADA_REPOS.md` — mapa repos (extracto §2 de este plan) |
| F1.6 | `docs/INDEX.md` | Enlace a plan conciliación + triada |

### Gate F1

- No contradicción entre tablero, `di-ledger.json` y este plan.
- `npm run architecture:validate` OK (solo docs tocados).

---

## F2 — EPIS2: verificar, commit y push PROG-DI (2 sesiones)

**Objetivo:** integrar WIP ~103 archivos con gates verdes y un commit trazable.

### Sesión F2-A — Verificación (obligatoria antes de stage)

```bash
npm run stack:dev          # Postgres + migrate + Ollama smoke
npm run db:migrate         # incluye 044_user_operational_memory
npm run check
npm run test
npm run db:validate
```

Gates PROG-DI (todos):

```bash
npm run quality:di-context-gate
npm run quality:di-memory-gate
npm run quality:di-autocomplete-gate
npm run quality:di-prefill-gate
npm run quality:di-suggestions-gate
npm run quality:di-templates-gate
npm run quality:di-timeline-gate
npm run quality:di-journeys-gate
npm run quality:di-signoff-gate
```

E2E:

```bash
npm run test:e2e:install
npm run test:e2e -- e2e/di-clinical-secretary-journey.spec.ts
npm run test:e2e -- e2e/dual-chart-modes.spec.ts
```

**Si falla:** corregir en la misma sesión; no commit parcial de DI.

### Sesión F2-B — Commit estructurado

**Estrategia:** un commit atómico PROG-DI (preferido) o dos commits máximo:

| Commit | Contenido | Mensaje sugerido |
|--------|-----------|------------------|
| **ENT-DI-01** (preferido) | Todo PROG-DI: código + migración 044 + gates + docs + reports MF-DI-* | `feat(di): close PROG-DETERMINISTIC-INTELLIGENCE MF-DI-01…10` |
| ENT-DI-02 (opcional) | Solo docs tablero post-cierre | `docs(tablero): PROG-DI committed; resume MF-SH-02` |

**Stage explícito (checklist):**

- [ ] `apps/api/**` (user, catalog, timeline, clinical)
- [ ] `apps/web/**` (chart, cds, operational memory)
- [ ] `packages/**` (clinical-domain, forms, command-registry, contracts, productivity)
- [ ] `database/migrations/044_*` + test migración
- [ ] `scripts/quality/validate-di-*` + `di-next.mjs`
- [ ] `docs/product/EPIS2_PROG_DETERMINISTIC_INTELLIGENCE.md`
- [ ] `docs/quality/di-ledger.json` + checklist signoff
- [ ] `e2e/di-clinical-secretary-journey.spec.ts`
- [ ] `reports/epis2-mf-di-*.md` + `epis2-prog-di-close-2026.md`
- [ ] `package.json` (scripts quality:di-*)

**Post-commit:**

```bash
git status   # limpio
git push origin master
```

### Gate F2

| Gate | Estado requerido |
|------|------------------|
| `quality:di-signoff-gate` | ✓ |
| `npm run check` | ✓ |
| `npm run test` | ✓ |
| `npm run db:validate` | ✓ |
| CI GitHub (push) | verde en master |

**Desbloquea:** F3, F5, retomar MF-SH-02 con base estable.

---

## F3 — epis2-evolab: push, sync findings, smoke (1 sesión)

**Objetivo:** simulador alineado con EPIS2 post-DI.

### Acciones

```bash
cd ../epis2-evolab
npm run check    # o typecheck + lint + test en Windows si quality aborta
git push origin master   # commit 6b9e40b F5
```

Desde EPIS2:

```bash
npm run stack:dev
npm run evolab:doctor
npm run evolab:smoke
npm run dev:evolab:sync          # refresca evolab-open-findings.json
npm run quality:evolab-bridge-gate
```

### Entregables

| ID | Artefacto |
|----|-----------|
| F3.1 | `reports/evolab-open-findings.json` actualizado |
| F3.2 | `reports/conciliacion/evolab-triage-YYYYMMDD.md` — tabla top-10 high con MF EPIS2 propuesto |
| F3.3 | Registro en `epis2-dev-registration.jsonl` (si F5 activo en Evolab) |

### Gate F3

- `evolab:smoke` verde contra EPIS2 post-push.
- Findings sync < 24 h.

---

## F4 — EPIS2-MedRepo: inventario, VCS y check verde (1–2 sesiones)

**Objetivo:** repositorio médico versionado y saludable antes de integración.

### F4-A — Inventario

| ID | Tarea |
|----|-------|
| F4.1 | Listar MF pendientes reales vs `MICROPHASES.md` (F2 migrate, MF-017b) |
| F4.2 | Export de prueba: `npm run medrepo:export:epis2` + `medrepo:export:verify` |
| F4.3 | Documentar tamaño DB, fuentes indexadas (sin PHI en reporte) |

### F4-B — Git + lint

```bash
cd ../EPIS2-MedRepo
git init
git add -A
git commit -m "chore: baseline MedRepo MF-001…020c snapshot"
# Crear remote: gh repo create gabriel2320/epis2-medrepo --private  # si aplica
git remote add origin https://github.com/gabriel2320/epis2-medrepo.git
git push -u origin master
```

Fix lint (8 errores — empezar por `scripts/pack-setup.mjs` unused import):

```bash
npm run check   # objetivo verde
```

### Gate F4

- `.git` presente · primer commit pushed.
- `npm run check` ✓
- `medrepo:doctor` ✓

---

## F5 — Gates tríada (1 sesión · smoke integrado)

**Objetivo:** verificar los tres repos juntos sin mezclar código.

### Secuencia recomendada

```bash
# Terminal 1 — EPIS2
cd EPIS2 && npm run stack:dev && npm run dev:api & npm run dev:web

# Terminal 2 — verificación
cd EPIS2
npm run quality:evolab-bridge-gate
npm run evolab:smoke
npm run quality:di-signoff-gate   # post F2

cd ../epis2-evolab
npm run evolab:validate

cd ../EPIS2-MedRepo
npm run medrepo:doctor
npm run medrepo:export:verify
```

### Entregable

`reports/conciliacion/triada-gates-YYYYMMDD.md` — tabla pass/fail por repo.

---

## F6 — Integración por contratos (2–3 sesiones · post F2–F5)

**Objetivo:** cablear consumo sin violar fronteras.

### F6.1 — Evolab → EPIS2 backlog (P2)

| Paso | Acción |
|------|--------|
| 1 | Triage 15 findings **high** → filas en `reports/conciliacion/evolab-backlog-*.md` |
| 2 | Mapear a MF-STRENGTHEN o bugfix (ej. R3.1 CDR `clinical_critical_results`) |
| 3 | Cerrar findings en Evolab tras fix: `evolab:review --decision approved` |

### F6.2 — clinical-case-intel ↔ Evolab (ya existe)

```bash
# Desde EPIS2 (post F2)
npm run case:export:evolab   # si script existe; si no, documentar en triada canon
```

Verificar escenarios SIM en `epis2-evolab/scenarios/`.

### F6.3 — MedRepo → EPIS2 Knowledge Pack (P3 · diseño mínimo)

| Paso | EPIS2 | MedRepo |
|------|-------|---------|
| 1 | Contrato en `packages/contracts` o `docs/fhir/` — schema pack v1 | `document-schemas` ya define |
| 2 | Loader read-only en capa CDS (sin SoT) | `medrepo:export:epis2` |
| 3 | Gate `quality:medrepo-pack-smoke` (nuevo, opcional F6) | manifest SHA verify |

**No hacer en F6:** importar `@medrepo/*` en apps EPIS2 — solo JSON estático o API local opcional.

### F6.4 — MedRepo → Evolab scenario pack

```bash
cd EPIS2-MedRepo
npm run medrepo:export:evolab
# Copiar bundle a epis2-evolab según README evolab-export
```

Completar **MF-017b** (casos sintéticos empaquetados).

---

## F7 — Cierre programa conciliación (1 sesión)

### Entregables

| ID | Documento |
|----|-----------|
| F7.1 | `reports/epis2-prog-conciliacion-triada-close-2026.md` |
| F7.2 | Actualización `EPIS2_TABLERO.md` — PROG-DI ✓ committed · MF-SH-02 siguiente |
| F7.3 | `di-ledger.json` — quitar `gitPending` |
| F7.4 | Entrada en `docs/quality/microphase-ledger.json` o ledger dedicado si se crea |

### Gates cierre global

```bash
# EPIS2
npm run check && npm run test && npm run db:validate
npm run quality:di-signoff-gate
npm run quality:strengthen-next   # debe mostrar MF-SH-02 READY

# Evolab
npm run evolab:validate

# MedRepo
npm run check && npm run medrepo:doctor
```

---

## 4. Cronograma sugerido (sesiones SDEPIS2)

| Sesión | Fase | Foco | Duración |
|--------|------|------|----------|
| S1 | F0 + F1 | Inventario + docs conciliados | 2 h |
| S2 | F2-A | Gates DI + tests + E2E | 3 h |
| S3 | F2-B | Commit + push EPIS2 | 1 h |
| S4 | F3 | Push Evolab + sync findings | 1.5 h |
| S5 | F4 | MedRepo git + lint | 2 h |
| S6 | F5 | Smoke tríada | 1 h |
| S7–S8 | F6 | Triage findings + pack mínimo | 4 h |
| S9 | F7 | Cierre + tablero | 1 h |

**Total:** ~15 h · 9 sesiones · **una microfase por sesión** (regla SDEPIS2).

---

## 5. Orden de commit y push (secuencia estricta)

```text
1. EPIS2  — F2 gates verdes → commit PROG-DI → push master
2. Evolab — push F5 (6b9e40b) → smoke contra EPIS2 nuevo
3. EPIS2  — commit docs F1/F3 (findings sync, triage) → push
4. MedRepo — git init → fix lint → baseline commit → push
5. MedRepo — exports verificados (sin push a EPIS2 aún)
6. EPIS2  — F6 integración (commits separados por contrato)
```

**Nunca:** push Evolab F5 antes de EPIS2 DI si smoke depende de endpoints DI nuevos.

---

## 6. Riesgos y rollback

| Riesgo | Mitigación |
|--------|------------|
| E2E DI falla pre-commit | No commit; fix en F2-A |
| CI rojo post-push EPIS2 | Revert commit único PROG-DI; hotfix en rama |
| Smoke Evolab rompe tras DI | `evolab:findings` + fix forward; no revert DI si gates pasaron |
| MedRepo git init pierde historial | Solo snapshot; no había historial previo |
| Pack MedRepo con PHI | `medrepo:phi:release` + policy antes de export |

---

## 7. Checklist ejecutivo (copiar al cerrar cada fase)

### F0 ☐
- [ ] Manifest WIP escrito
- [ ] Doctor Evolab ejecutado

### F1 ☐
- [ ] Tablero + plan DI alineados
- [ ] `architecture:validate` OK

### F2 ☐
- [ ] 9 gates DI + signoff OK
- [ ] test + db:validate OK
- [ ] Commit PROG-DI pushed · CI verde

### F3 ☐
- [x] Evolab pushed
- [x] findings sync fresco
- [x] smoke OK

### F4 ☐
- [x] MedRepo en git · check verde

### F5 ☐
- [x] Informe gates tríada

### F6 ☐
- [x] Backlog Evolab triaged
- [x] Export MedRepo verificado
- [ ] (Opcional) loader pack EPIS2

### F7 ☐
- [ ] Reporte cierre
- [ ] Tablero actualizado
- [ ] MF-SH-02 declarado siguiente

---

## 8. Próximo paso inmediato

**Sesión S1 (F0+F1):** ejecutar inventario y conciliar docs **sin commit de código**.

Comando de arranque:

```bash
cd EPIS2
npm run dev:session
mkdir reports/conciliacion
git status -sb > reports/conciliacion/epis2-wip-manifest-20260614.txt
git diff --stat >> reports/conciliacion/epis2-wip-manifest-20260614.txt
```

Declarar alcance SDEPIS2: **Programa PROG-CONCILIACION-TRIADA-2026 · Fase F0–F1 · paths:** `reports/conciliacion/**`, `docs/product/EPIS2_TABLERO.md`, `reports/epis2-plan-deterministic-intelligence-2026-06-14.md`.

---

## Referencias

- [EPIS2_EVOLAB_INTEGRATION.md](../docs/product/EPIS2_EVOLAB_INTEGRATION.md)
- [EPIS2_PROG_DETERMINISTIC_INTELLIGENCE.md](../docs/product/EPIS2_PROG_DETERMINISTIC_INTELLIGENCE.md)
- [epis2-plan-fases-desarrollo-2026-06-13.md](./epis2-plan-fases-desarrollo-2026-06-13.md)
- [epis2-prog-di-close-2026.md](./epis2-prog-di-close-2026.md)
- MedRepo: `../EPIS2-MedRepo/docs/ARCHITECTURE.md`

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
