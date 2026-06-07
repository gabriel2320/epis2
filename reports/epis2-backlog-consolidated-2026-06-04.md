# EPIS2 — Backlog consolidado (post-auditoría general)

**Fecha:** 2026-06-04 · **Fuente:** [`epis2-general-audit-2026-06-04.md`](./epis2-general-audit-2026-06-04.md)

---

## Próxima sesión (0–4 h)

| # | Tarea | Prioridad | Criterio done |
|---|-------|-----------|---------------|
| 1 | **Commit arco UX + Command Engine** (~188 archivos) | P0 | `git status` limpio; mensaje describe CE-0→CE-5 + wire híbrido |
| 2 | Ejecutar `quality:golden-journey` + `quality:ux-pilot` | P1 | Salida verde documentada en reporte |
| 3 | Actualizar `EPIS2_COMPLETION_ROADMAP.md` (511 tests, auth-adjacent ✓) | P1 | Sin contradicción numérica |
| 4 | Storybook: story `EpisCommandCenterHero` + dock | P2 | `storybook:ui:build` OK |

---

## Próxima semana

| # | Tarea | Prioridad | Notas |
|---|-------|-----------|-------|
| 5 | PR review checklist M3-G01…G15 en pantallas tocadas | P1 | `M3_ANTI_DRIFT_GATES.md` |
| 6 | Flatten admin (`AdminConsolePage`, `BlueprintStudioPanel`) | P2 | LAYOUT-G12 |
| 7 | Tag release demo: `UX-COMMAND-FIRST-2026-06` | P1 | Tras commit |
| 8 | Consolidar `reports/` — índice maestro + archivar duplicados | P2 | 224 → índice 20 vigentes |
| 9 | `migration/candidates/lyra/` — allowlist o eliminar del tree | P2 | Legacy boundary |
| 10 | WIDGET-01: montar ≤2 widgets en comando con gate | P2 | `resolveWidgetVisibility` |
| 11 | Historial comandos (API + UI mínima) | P2 | Roadmap Ola 1 |
| 12 | E2E smoke compuesto en CI (ux-g02 + login + golden V0) | P1 | Paridad local-ci |

---

## Siguiente fase (Ola 2 producto)

| # | Tarea | Dependencia |
|---|-------|-------------|
| 13 | Blueprint ingreso hospitalario completo | Commit arco UX |
| 14 | Comando `haz ingreso` → formulario | registry + blueprint |
| 15 | Consulta ambulatoria profundidad | `outpatient-visit` blueprint existe |
| 16 | Cierre encuentro E2E | API encuentros |
| 17 | `quality:ola2-m3-ui-gate` en cada entrega UI | Gate existente |

**No iniciar** hasta P0-1 cerrado.

---

## Antes de piloto institucional

| # | Entregable | Gate |
|---|------------|------|
| 18 | Signoff humano V1–V6 M3 | `quality:m3-human-pilot` |
| 19 | `PILOT_DEMO_CHECKLIST.md` completo | Producto |
| 20 | Walkthrough `EPIS2_PILOT_INSTITUTIONAL_WALKTHROUGH.md` | Demo script |
| 21 | OIDC staging probado | `docs/ops/OIDC_STAGING.md` |
| 22 | RLS runbook ejecutado | `RLS_STAGING_RUNBOOK.md` |
| 23 | Sin copy «Ollama» en UI clínica | grep + gate |
| 24 | Bundle budget / MUI-G13 | `qa:bundle-analyze` |
| 25 | Acta signoff clínico | `EPIS2_CLINICAL_SIGNOFF_ACTA_TEMPLATE.md` |

---

## Después de piloto

| # | Tarea |
|---|-------|
| 26 | UX-G04 — rail ≤5 destinos (piloto feedback) |
| 27 | IDC matriz — priorizar dominios Done vs scaffold |
| 28 | Vitest 4.x + npm audit remediate |
| 29 | Comparación versiones borrador |
| 30 | Interop HL7 writeback producción (MF-182 scope) |
| 31 | OIDC producción + multi-tenant |
| 32 | Visual regression (Storybook/Chromatic o equivalente) |

---

## Matriz rápida P0–P3 → acción

| ID | Acción inmediata |
|----|------------------|
| P0-1 | Git commit + tag |
| P1-1 | Editar roadmap + audit reconcile banner |
| P1-3 | Script CI `quality:golden-journey` |
| P2-1 | Admin flatten (sesión dedicada) |
| P2-6 | `reports/README.md` índice |

---

## Orden de ejecución recomendado

```text
Commit UX/CE → gates compuestos → doc sync → tag demo
    → piloto humano → Ola 2 ingreso/ambulatorio
```

---

*Backlog vivo — no sustituye `EPIS2_WAVE_EXECUTION_CANON.md`.*
