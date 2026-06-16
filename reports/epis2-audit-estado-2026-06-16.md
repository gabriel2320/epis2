# EPIS2 — Auditoría de estado (post-RC3 + operaciones)

**Fecha:** 2026-06-16 · **HEAD:** `80ef608` · **Tag demo:** `v0.1-demo-rc3`  
**Audiencia:** operador · agentes Cursor  
**Congelamiento:** [`CONSOLIDATION_FREEZE.md`](../docs/CONSOLIDATION_FREEZE.md) vigente

---

## Veredicto ejecutivo

EPIS2 está en **base demo v0.1 consolidada y endurecida**. El flujo mínimo clínico funciona y está gateado. Los programas de producto, consolidación, release y post-RC3 están **cerrados**. La fase actual es **pre-piloto UX sintético** (`PROG-UX-LAB`), no expansión clínica.

| Dimensión | Estado |
|-----------|--------|
| Producto demo v0.1 | ✓ núcleo entregable |
| CI / branch protection | ✓ 5 required checks + RH-12 audit PASS |
| Seguridad PR | ✓ RH-09/10/11 blocking |
| Piloto UX humano | ◐ GO 2026-06-04 · lab moderno propuesto |
| Expansión clínica | ✗ congelada por diseño |

---

## 1. Programas cerrados (evidencia)

| Programa | Cierre | Gate / evidencia |
|----------|--------|------------------|
| PROG-FICHA-FIRST | MF-FF-01…15 | `quality:ficha-first-gate` · [`epis2-prog-ficha-first-close-2026.md`](epis2-prog-ficha-first-close-2026.md) |
| PROG-STRENGTHEN | 23/23 MF | `quality:strengthen-close-gate` · [`epis2-prog-strengthen-close-2026.md`](epis2-prog-strengthen-close-2026.md) |
| PROG-CONSOLIDATE | ola 1+2 | [`epis2-prog-consolidate-ola2-close-2026.md`](epis2-prog-consolidate-ola2-close-2026.md) |
| PROG-RELEASE-HARDENING | RH-01…08 | tag `v0.1-demo-rc3` · PR #15+#16 |
| PROG-POST-RC3 | tramos 1–5 | [`epis2-prog-post-rc3-close.md`](epis2-prog-post-rc3-close.md) |
| MF-LOCK-RC3-01 | branch protection | PR #23 · [`epis2-branch-protection-verify-2026-06-16.md`](epis2-branch-protection-verify-2026-06-16.md) |
| RH-12 | auditor workflow | PR #26+#27 · audit PASS run [27625029778](https://github.com/gabriel2320/epis2/actions/runs/27625029778) |

### Entregas producto relevantes (histórico reciente)

- **GO DEMO UX/CE** 2026-06-04 · [`PILOT_DEMO_CHECKLIST.md`](../docs/quality/PILOT_DEMO_CHECKLIST.md)
- **PROG-PAPER-MODE / PLANNER** 2026-06-11 · [`epis2-prog-paper-planner-close-2026-06-11.md`](epis2-prog-paper-planner-close-2026-06-11.md)
- **PROG-DI + tríada** · [`epis2-prog-conciliacion-triada-close-2026.md`](epis2-prog-conciliacion-triada-close-2026.md)

---

## 2. Núcleo Base v0.1

| Criterio | Estado |
|----------|--------|
| Login demo · pacientes DEMO/SIM | ✓ |
| Home censo + barra transversal | ✓ |
| Ficha dual MD3 \| papel | ◐ parcial |
| Command registry · formularios core | ✓ |
| Borrador → aprobación humana · auditoría | ✓ |
| IA degradable (Ollama off) | ✓ |
| Golden journey | ✓ |
| Ambulatorio completo · farmacia HIS | ◐ / ✗ |

Core intocable — ver [`EPIS2_CURRENT_STATE.md`](../docs/EPIS2_CURRENT_STATE.md).

---

## 3. CI y operaciones (2026-06-16)

### Required checks `master`

1. `required`
2. `e2e-dual-chart`
3. `gitleaks (blocking)`
4. `CodeQL (javascript-typescript, blocking) (javascript-typescript)`
5. `dependency-review (blocking)`

### Tags vs master

`master` (~`80ef608`) va **por delante** de `v0.1-demo-rc3` (POST-RC3 + MF-LOCK + RH-12). Re-tag forzado **no** recomendado.

---

## 4. Lo planeado antes vs realidad

### Plan unificado (`epis2-plan-desarrollo-unificado-2026-06-14.md` v1.6)

| Fase | Plan | Resultado |
|------|------|-----------|
| A — Producto + IA (STRENGTHEN) | MF-IM/CU/IC | ✓ 100 % |
| B — E2E higiene (`epis2-power-bar` legacy) | paralelo | ◐ diferido |
| C — Compactación bloque D | post-STRENGTHEN | ✗ diferido |
| PROG-POST-RC3 | gobierno · parity · legal · deps · security | ✓ cerrado |
| PROG-MEDIA-FUTURE | 2027+ | ✗ diferido |
| PROG-ZOD4-MIGRATION | Zod 4 | ✗ diferido |

### Auditoría post-RC3 (`epis2-audit-plan-post-rc3-2026.md`)

| Deuda | Estado |
|-------|--------|
| D-01 CRLF Windows | ✓ MF-DEV-01 |
| D-02…D-07 security blocking | ✓ RH-09/10/11 |
| D-03 Dependabot | ◐ 5 vulns default branch |
| D-04 tablero stale | ◐ corregido en esta sesión |
| D-05 plan §6 stale | ◐ corregido en esta sesión |
| D-08 archivar reports | ✗ pendiente |
| D-09 E2E power-bar | ✗ pendiente |
| Branch protection | ✓ MF-LOCK + RH-12 |

### Piloto UX

| Artefacto | Estado |
|-----------|--------|
| Checklist GO 2026-06-04 | ✓ hecho |
| Clinical Shift Lab (propuesta amplia) | auditada · recortada |
| **PROG-UX-LAB** plan moderno | [`EPIS2_UX_LAB_MODERN_PLAN.md`](../docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md) · 4 tramos |

---

## 5. Deuda viva

| ID | Severidad | Hallazgo |
|----|-----------|----------|
| UX-01 | Media | Brecha percepción clínica post-RC3 — PROG-UX-LAB sin ejecutar |
| DEP-01 | Media | 5 vulnerabilidades Dependabot (2 high) en default branch |
| DOC-01 | Baja | ~460 `reports/*.md` en raíz — archivar lote |
| E2E-01 | Baja | Specs legacy `epis2-power-bar` |
| TAG-01 | Info | `v0.1-demo-rc3` desfasado de master — consciente |

---

## 6. Siguiente paso recomendado

**Programa:** `PROG-UX-LAB` · **Tramo A** MF-UXLAB-00  
**Plan:** [`docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md`](../docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md)

```bash
npm run quality:golden-journey
npm run quality:ux-pilot
npm run quality:security-promote-gate
npm run quality:fast
```

**Diferido:** PROG-ZOD4-MIGRATION · PROG-COMPACTACION · PROG-E2E-HYGIENE · PROG-MEDIA-FUTURE.

**Prohibido sin MF autorizada:** features clínicas nuevas · nuevo home · segundo registry.

---

## 7. Referencias

| Doc | Rol |
|-----|-----|
| [`EPIS2_CURRENT_STATE.md`](../docs/EPIS2_CURRENT_STATE.md) | Brújula |
| [`EPIS2_TABLERO.md`](../docs/product/EPIS2_TABLERO.md) | Índice humano |
| [`epis2-prog-post-rc3-close.md`](epis2-prog-post-rc3-close.md) | Cierre POST-RC3 |
| [`epis2-branch-protection-verify-2026-06-16.md`](epis2-branch-protection-verify-2026-06-16.md) | MF-LOCK + RH-12 |
