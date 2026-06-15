# PROG-CONSOLIDATE ola 2 — Plan cierre CI + PRs #7 / #8

**Fecha:** 2026-06-15 · **Programa:** PROG-CONSOLIDATE-2  
**PRs abiertos:** [#7](https://github.com/gabriel2320/epis2/pull/7) MF-CON-02 · [#8](https://github.com/gabriel2320/epis2/pull/8) MF-CON-04/05  
**Canon ola 2:** [`docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md`](../docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md) · freeze [`docs/CONSOLIDATION_FREEZE.md`](../docs/CONSOLIDATION_FREEZE.md)

**Handoff siguiente sesión:** [`epis2-session-handoff-consolidation-2-2026-06-15.md`](./epis2-session-handoff-consolidation-2-2026-06-15.md)

---

## Objetivo de esta sesión

Desbloquear CI en PRs de consolidación ola 2: job `check` (E2E legacy + gates) y job `e2e-dual-chart` (ficha dual opt-in).

**No mezclar** con docs untracked de gobierno (`MONOREPO_GOVERNANCE.md`, plan ola 2 completo) — van en PR-003 aparte.

---

## Diagnóstico (cadena de causas)

| # | Síntoma CI | Causa raíz |
|---|------------|------------|
| 1 | 13 specs legacy buscaban `epis2-patient-workspace` / command bar | Job `check` construía web **sin** `VITE_ENABLE_DUAL_CHART_MODES=false` (dual ON por defecto) |
| 2 | Tras fix CI dual-off: 18 fallos en `loginAsPhysician` | `ClinicalShellLayout` solo montaba `ChartEspacioCommandDock` si dual ON → sin `epis2-census-command-bar` en censo |
| 3 | `golden-command-evolution` strict mode | Doble barra en ficha legacy: shell + `PatientWorkspaceCommandPanel` |
| 4 | UX-G02 Parte A/C1 (TAC) | `ChartEspacioCommandDock` resolvía `needs_confirmation` pero **no** montaba `CommandConfirmationDialog` |
| 5 | `format:check` en master | Prettier pendiente en `ChartEspacioCommandDock.tsx` |

**Conflicto diseño (resuelto por split CI):** UX-G02 Parte E (MF-CM-08) requiere dual ON → `test.skip` en legacy job; cubierto en `e2e/dual-chart-modes.spec.ts` test `o)`.

---

## Fixes aplicados (master)

| Commit | Entrega |
|--------|---------|
| `a43d9e0` | CI: `VITE_ENABLE_DUAL_CHART_MODES: 'false'` en job `check`; skip/migración UX-G02 E |
| `9792ed9` | Web: barra censo siempre en `ClinicalShellLayout` |
| `e45c16c` | Web: omitir dock en `/espacio/ficha` cuando dual OFF (evita duplicado) |
| `3a8f6d2` | Web: `CommandConfirmationDialog` en `ChartEspacioCommandDock` |
| `0b7c748` | Prettier `ChartEspacioCommandDock.tsx` |
| `c4b7fd0` | Theme: hex hardcoded en JSDoc (`paper-visual-reference`) — solo master hasta rebase PRs |

Cherry-picks en ramas PR (#7 `f3daa42`, #8 `daefbee`) — **sin** `0b7c748` ni `c4b7fd0` al cierre de documentación.

**Verificación local (dual OFF, bundle CI):**

```powershell
$env:VITE_ENABLE_DUAL_CHART_MODES='false'
$env:CI='true'
npm run build -w @epis2/web
npx playwright test --config playwright.config.ts e2e/ux-g02-command-first.spec.ts
# → 4 passed, 1 skipped (Parte E)
```

Job `e2e-dual-chart`: **21 passed** en run previo con dual ON.

---

## Estado al documentar

| Artefacto | Estado |
|-----------|--------|
| `master` @ `0b7c748` | CI run en curso (`check` + `e2e-dual-chart`) |
| PR #7 / #8 | Runs cancelados; **sin** CI verde reciente; ramas detrás de master |
| Untracked local | `docs/MONOREPO_GOVERNANCE.md`, `docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md` — **no** incluir en #7/#8 |

---

## Plan de ejecución (orden estricto)

### Fase A — Confirmar master verde

1. Esperar conclusión run CI en `master` (commit `0b7c748`).
2. Si falla: leer `gh run view <id> --log-failed`; corregir diff mínimo; no reabrir fixes ya cerrados sin evidencia.

```bash
gh run list --branch master --limit 3
gh run watch <run-id> --exit-status
```

### Fase B — Sincronizar PRs #7 y #8

En cada rama de PR, traer commits de master posteriores al cherry-pick:

```bash
git checkout chore/epis2-consolidation-2
git cherry-pick c4b7fd0 0b7c748   # o: git rebase master
git push origin chore/epis2-consolidation-2

git checkout chore/epis2-consolidation-2-config-auth
git rebase master                 # preferible: #8 encima de #7 tras merge
git push origin chore/epis2-consolidation-2-config-auth
```

3. Verificar CI en ambos PRs (~25–30 min E2E).

```bash
gh pr checks 7
gh pr checks 8
```

### Fase C — Merge

| Orden | PR | MF | Condición |
|-------|-----|-----|-----------|
| 1 | [#7](https://github.com/gabriel2320/epis2/pull/7) | MF-CON-02 freeze docs | `check` + `e2e-dual-chart` ✓ |
| 2 | [#8](https://github.com/gabriel2320/epis2/pull/8) | MF-CON-04/05 config + auth | Rebase post-#7 · CI ✓ |

**No** squash mezclando MF-CON-02 con MF-CON-04/05 en un solo merge.

### Fase D — Cierre SDEPIS2

```bash
npm run dev:session          # regenerar brief + prompts
npm run quality:clinical     # o quality:full si signoff
npm run dev:agent:close
```

Completar `reports/epis2-session-close-*.md`:

- Alcance: MF-CON-02 + MF-CON-04/05 + cadena CI E2E
- Gates ejecutados y resultado
- Riesgo residual: PR-003 gobierno monorepo pendiente
- Próximo paso exacto: **MF-CON-06** (baseline HTTP) según [`EPIS2_CONSOLIDATION_PHASE2_PLAN.md`](../docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md)

Actualizar [`docs/product/EPIS2_TABLERO.md`](../docs/product/EPIS2_TABLERO.md) — hoy desalineado (“Siguiente MF-CON-04+05” ya en PR #8).

---

## Mapa PR ola 2 (referencia)

| PR doc | MF | Rama / PR | Estado sesión |
|--------|-----|-----------|---------------|
| 002 | MF-CON-02 | `chore/epis2-consolidation-2` · #7 | Abierto · CI pendiente re-sync |
| 004+005 | MF-CON-04/05 | `chore/epis2-consolidation-2-config-auth` · #8 | Abierto · CI pendiente re-sync |
| 003 | MF-CON-03 | — | Untracked local · PR aparte |
| 006+ | MF-CON-06… | — | No iniciar hasta merge #7+#8 |

---

## Archivos tocados (cadena CI/E2E)

| Archivo | Rol |
|---------|-----|
| `.github/workflows/ci.yml` | `VITE_ENABLE_DUAL_CHART_MODES=false` en job `check` |
| `apps/web/src/layouts/ClinicalShellLayout.tsx` | Montar `ChartEspacioCommandDock` siempre (shell legacy) |
| `apps/web/src/components/chart/ChartEspacioCommandDock.tsx` | Skip ficha legacy dual-off + diálogo confirmación |
| `e2e/ux-g02-command-first.spec.ts` | Skip Parte E si dual off |
| `e2e/dual-chart-modes.spec.ts` | Test `o)` MF-CM-08 / UX-G02 E |

---

## Riesgos y detenerse si

- `architecture:validate` falla post-merge
- Segundo registry temporal o import EPIS sin manifest
- Contradicción con [`PRODUCT_INVARIANTS.md`](../docs/product/PRODUCT_INVARIANTS.md)

---

## Comandos útiles

```bash
# Repro E2E legacy local (Postgres + stack)
npm run stack:dev
$env:VITE_ENABLE_DUAL_CHART_MODES='false'; $env:CI='true'
npm run build -w @epis2/web
npm run test:e2e

# E2E dual (paridad job e2e-dual-chart)
$env:VITE_ENABLE_DUAL_CHART_MODES='true'; $env:CI='true'
npm run build -w @epis2/web
npm run test:e2e:dual-chart
```

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
