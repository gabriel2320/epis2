# Handoff sesión — PROG-CONSOLIDATE ola 2 · CI + PRs #7 / #8

**Para:** siguiente sesión Cursor / SDEPIS2  
**Generado:** 2026-06-15 · **Rama local:** `master` @ `0b7c748`  
**Programa:** PROG-CONSOLIDATE-2 (congelamiento features — ver PR #7)  
**Diagnóstico técnico:** [`epis2-consolidation-2-ci-close-plan-2026-06-15.md`](./epis2-consolidation-2-ci-close-plan-2026-06-15.md)

---

## 1. Arranque obligatorio (copiar al primer mensaje)

```text
Alcance SDEPIS2 — tramo PROG-CONSOLIDATE-2 cierre CI
Objetivo: CI verde en master + merge PR #7 → #8
MF: MF-CON-02 (PR #7) · MF-CON-04/05 (PR #8)
Allowlist: .github/workflows/ci.yml, apps/web/src/layouts/ClinicalShellLayout.tsx,
  apps/web/src/components/chart/ChartEspacioCommandDock.tsx, e2e/*.spec.ts,
  apps/api/src/config*, apps/api/src/auth/* (solo rama #8),
  docs/CONSOLIDATION_* (solo rama #7)
Prohibido: segundo registry, import EPIS sin manifest, MF-FF/STRENGTHEN nuevos,
  docs MONOREPO_GOVERNANCE / plan ola 2 en estos PRs
Gate iteración: npm run quality:fast
Gate cierre MF: npm run quality:clinical o npm run quality:full
Detenerse si: architecture:validate falla · contradice PRODUCT_INVARIANTS
```

**Adjuntar en Cursor:**

1. `@docs/AGENT_CONTEXT_MINIMAL.md`
2. `@reports/epis2-session-handoff-consolidation-2-2026-06-15.md` (este doc)
3. `@reports/epis2-consolidation-2-ci-close-plan-2026-06-15.md`

```bash
npm run stack:dev          # una vez si Postgres apagado
npm run dev:session        # tras merge — regenerar brief (hoy desactualizado MF-FF-04)
```

**Brief actual:** [`dev-agent-brief.md`](./dev-agent-brief.md) apunta a MF-FF-04 — **no** seguir ese hilo salvo petición explícita; hilo activo = consolidación ola 2.

---

## 2. Snapshot al cerrar sesión anterior

### Repositorio

| Item | Valor |
|------|--------|
| `master` HEAD | `0b7c748` — Prettier `ChartEspacioCommandDock` |
| CI master run | [27516471242](https://github.com/gabriel2320/epis2/actions/runs/27516471242) — **in_progress** @ `0b7c748` |
| PR #7 rama | `chore/epis2-consolidation-2` @ `f3daa42` |
| PR #8 rama | `chore/epis2-consolidation-2-config-auth` @ `daefbee` |
| PR checks | Solo Bugbot — **sin** `check` / `e2e-dual-chart` reciente (runs cancelados) |

### Commits en `master` que faltan en PRs (re-sync obligatorio)

```text
0b7c748 fix(web): format ChartEspacioCommandDock for CI format:check
c4b7fd0 fix(theme): remove hardcoded hex from paper-visual-reference JSDoc
b42a2b0 fix(test): align GeneratedClinicalFormPage tests with TraditionalEhr shell
```

(PRs ya tienen cherry-picks equivalentes de `a43d9e0`…`3a8f6d2` con SHAs distintos.)

### Untracked local (no mezclar en #7/#8)

| Archivo | Uso |
|---------|-----|
| `docs/MONOREPO_GOVERNANCE.md` | PR-003 MF-CON-03 |
| `docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md` | Canon ola 2 (referencia) |
| `reports/epis2-consolidation-2-ci-close-plan-2026-06-15.md` | Diagnóstico CI |

### PRs abiertos

| PR | MF | Contenido propio (no en master) |
|----|-----|--------------------------------|
| [#7](https://github.com/gabriel2320/epis2/pull/7) | MF-CON-02 | `docs/CONSOLIDATION_FREEZE.md`, links ola 2, theme fix duplicado `359ea2e` |
| [#8](https://github.com/gabriel2320/epis2/pull/8) | MF-CON-04/05 | `config.ts` staging/prod guards, `isDemoAuthEnabled`, killswitch auth, tests |

---

## 3. Trabajo ya hecho (no re-auditar salvo regresión)

Cadena E2E legacy (dual OFF en job `check`):

1. **CI** — `VITE_ENABLE_DUAL_CHART_MODES: 'false'` en `.github/workflows/ci.yml`
2. **Shell** — `ChartEspacioCommandDock` siempre en `ClinicalShellLayout`
3. **Ficha legacy** — dock omitido en `/espacio/ficha` cuando dual OFF (evita doble barra)
4. **Confirmación** — `CommandConfirmationDialog` en `ChartEspacioCommandDock`
5. **E2E split** — UX-G02 Parte E → skip legacy + test `o)` en `e2e/dual-chart-modes.spec.ts`
6. **Prettier** — `ChartEspacioCommandDock.tsx`

**Verificado local** (dual OFF, `CI=true`, bundle preview):

- `e2e/ux-g02-command-first.spec.ts` → 4 passed, 1 skipped
- `e2e/golden-command-evolution.spec.ts` → OK (vía floating dock en ficha)
- Job `e2e-dual-chart` previo → 21 passed

---

## 4. Plan detallado — siguiente sesión

### Paso 0 — Estado CI master (5 min)

```bash
gh run list --branch master --limit 3
gh run view 27516471242 --json conclusion,status,jobs
gh pr checks 7 && gh pr checks 8
```

| Resultado master `0b7c748` | Acción |
|----------------------------|--------|
| **Ambos jobs ✓** | Ir a Paso 1 |
| **Fallo `format:check` / `check` / vitest** | Fix mínimo en allowlist · `npm run quality:fast` · push master |
| **Fallo `test:e2e` legacy** | `gh run view <id> --log-failed` · repro local (§6) · no reintroducir dual ON en job `check` |
| **Fallo `e2e-dual-chart`** | Revisar `e2e/dual-chart-modes.spec.ts` test `o)` · job usa `VITE_ENABLE_DUAL_CHART_MODES=true` |
| **Fallo post-E2E** (`db:validate`, `golden-journey`, audit) | Gate específico — ver log step |

---

### Paso 1 — Sincronizar ramas PR (15 min)

**Objetivo:** cada PR en HEAD con todos los fixes de master + su contenido MF.

#### Opción A — Rebase (recomendada tras master verde)

```bash
git fetch origin
git checkout chore/epis2-consolidation-2
git rebase origin/master
# resolver conflictos: preferir master en archivos CI/E2E/web dock; mantener docs CON-02
git push --force-with-lease origin chore/epis2-consolidation-2

git checkout chore/epis2-consolidation-2-config-auth
git rebase origin/master
# resolver: mantener config.ts + auth de CON-04/05
git push --force-with-lease origin chore/epis2-consolidation-2-config-auth
```

#### Opción B — Cherry-pick mínimo (si rebase conflictivo)

```bash
git checkout chore/epis2-consolidation-2
git cherry-pick c4b7fd0 0b7c748
git push origin chore/epis2-consolidation-2

git checkout chore/epis2-consolidation-2-config-auth
git cherry-pick c4b7fd0 0b7c748
git push origin chore/epis2-consolidation-2-config-auth
```

**Esperar CI PR** (~25–30 min). No mergear con runs cancelados o SHA antiguo.

```bash
gh run watch <run-id-pr7> --exit-status
gh run watch <run-id-pr8> --exit-status
```

---

### Paso 2 — Merge PR #7 MF-CON-02 (10 min)

**Precondiciones:**

- [ ] `check` ✓ y `e2e-dual-chart` ✓ en PR #7
- [ ] `architecture:validate` pasó en CI
- [ ] Revisión humana: solo docs freeze + fixes CI compartidos

```bash
gh pr merge 7 --merge --delete-branch=false
git checkout master && git pull origin master
```

**Post-merge master:**

- Aparece `docs/CONSOLIDATION_FREEZE.md` en master
- Regenerar contexto: `npm run dev:session`

---

### Paso 3 — Rebase PR #8 y merge MF-CON-04/05 (20 min)

```bash
git fetch origin
git checkout chore/epis2-consolidation-2-config-auth
git rebase origin/master
git push --force-with-lease origin chore/epis2-consolidation-2-config-auth
# esperar CI verde
gh pr merge 8 --merge
git checkout master && git pull
```

**Validación MF-CON-04/05 local (opcional, rápida):**

```bash
npm run test -w @epis2/api -- config.test auth.test
npm run check
```

---

### Paso 4 — Cierre SDEPIS2 (30 min)

```bash
npm run quality:clinical   # o npm run quality:full pre-release
npm run db:validate
npm run dev:agent:close
```

**Reporte:** `reports/epis2-session-close-2026-06-15-consolidation-2.md`

| Sección | Contenido |
|---------|-----------|
| Alcance | MF-CON-02 + MF-CON-04/05 + cadena CI E2E |
| Gates | listar comandos + resultado |
| PRs | #7 #8 merged + SHAs |
| Riesgos | demo auth solo dev/test; staging requiere SESSION_SECRET |
| Próximo paso | **MF-CON-06** baseline HTTP — ver plan ola 2 |

**Tablero:** actualizar [`docs/product/EPIS2_TABLERO.md`](../docs/product/EPIS2_TABLERO.md) — quitar “Siguiente MF-CON-04+05”; marcar CON-02/04/05 DONE.

---

## 5. Árbol de contingencias

| Síntoma | Hipótesis | Fix |
|---------|-----------|-----|
| `epis2-census-command-bar` not found | Dock no montado | Ver `ClinicalShellLayout` línea `commandBar={<ChartEspacioCommandDock />}` |
| Strict mode 2 command bars | Doble dock ficha | `ChartEspacioCommandDock` return null en `/espacio/ficha` + dual OFF |
| TAC sin diálogo | Falta dialog | `CommandConfirmationDialog` en `ChartEspacioCommandDock` |
| 13 specs buscan `epis2-patient-workspace` | Dual ON en build CI | `VITE_ENABLE_DUAL_CHART_MODES=false` en job `check` |
| Parte E falla legacy | Esperado dual | `test.skip` en ux-g02 · cubrir en dual-chart job |
| Login 403 en CI PR #8 | `isDemoAuthEnabled` | CI usa `NODE_ENV=test` → demo OK; verificar env en playwright webServer |
| Prettier fail | Formato | `npx prettier --write apps/web/src/components/chart/ChartEspacioCommandDock.tsx` |
| Rebase conflict `config.ts` | #8 vs master | Mantener guards CON-04/05 de #8 + imports master |

**No hacer:**

- Segundo registry temporal
- Mezclar PR-003 gobierno monorepo en #7/#8
- Iniciar MF-FF-04 / STRENGTHEN sin instrucción usuario
- `git push --force` a `master`

---

## 6. Repro local E2E (paridad CI)

**Requisitos:** `npm run stack:dev` · Postgres :5433

### Legacy (job `check`)

```powershell
cd "C:\Users\gdela\OneDrive\Documentos Importantes\EPIS2"
$env:VITE_ENABLE_DUAL_CHART_MODES='false'
$env:CI='true'
npm run build -w @epis2/web
npm run test:e2e
```

### Dual chart (job `e2e-dual-chart`)

```powershell
$env:VITE_ENABLE_DUAL_CHART_MODES='true'
$env:CI='true'
npm run build -w @epis2/web
npm run test:e2e:dual-chart
```

### Subset rápido (~1 min)

```powershell
npx playwright test --config playwright.config.ts `
  e2e/golden-command-evolution.spec.ts `
  e2e/ux-g02-command-first.spec.ts `
  e2e/login-gateway.spec.ts
```

**Nota:** fallo `Timed out waiting webServer` = API no levantada; Playwright arranca API automáticamente si puerto libre.

---

## 7. Roadmap ola 2 post-merge (no ejecutar en esta sesión)

Orden según [`docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md`](../docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md):

| Orden | MF | PR doc | Entrega |
|-------|-----|--------|---------|
| ✓ | CON-02 | 002 | Freeze docs — **#7** |
| ✓ | CON-04/05 | 004+005 | Config + auth — **#8** |
| → | CON-03 | 003 | Gobierno monorepo + `MONOREPO_GOVERNANCE.md` |
| | CON-06 | 006 | Baseline HTTP CSP/cookies/CORS |
| | CON-07 | 007 | Rate limit Redis staging/prod |
| | CON-09…11 | 009–011 | Fixtures, legal, CI split workflows |

**Paralelo producto (ledger distinto):** Ficha-first MF-FF-04 READY en brief — no mezclar con freeze CON.

---

## 8. Checklist imprimible

```
[ ] Paso 0 — master CI 0b7c748 verde
[ ] Paso 1 — PR #7 y #8 rebased/cherry-picked + CI verde
[ ] Paso 2 — Merge PR #7
[ ] Paso 3 — Rebase + merge PR #8
[ ] Paso 4 — quality:clinical + reporte cierre + dev:session
[ ] Tablero actualizado
[ ] Sin untracked mezclados accidentalmente en merge
```

---

## 9. Referencias

| Doc | Uso |
|-----|-----|
| [`epis2-consolidation-2-ci-close-plan-2026-06-15.md`](./epis2-consolidation-2-ci-close-plan-2026-06-15.md) | Diagnóstico técnico cadena E2E |
| [`epis2-prog-consolidate-close-2026.md`](./epis2-prog-consolidate-close-2026.md) | Cierre ola 1 PR #6 |
| [`docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md`](../docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md) | Mapa PRs 002–011 |
| [`docs/product/PRODUCT_INVARIANTS.md`](../docs/product/PRODUCT_INVARIANTS.md) | Stop conditions |
| [`docs/quality/GOLDEN_CLINICAL_JOURNEY.md`](../docs/quality/GOLDEN_CLINICAL_JOURNEY.md) | Gate producto |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
