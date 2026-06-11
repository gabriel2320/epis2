# EPIS2 — Migración dual ficha (desde comando / classic / dashboard)

**ADR:** [`ADR-002`](../adr/ADR-002-dual-chart-modes.md) · **Plan v2:** [`EPIS2_DUAL_CHART_DEV_PLAN.md`](../product/EPIS2_DUAL_CHART_DEV_PLAN.md) · **Canon:** [`EPIS2_DUAL_CHART_VISUAL_CANON.md`](../design/EPIS2_DUAL_CHART_VISUAL_CANON.md)

---

## Principio

**Ficha médica real primero; IA debajo.** Command bar transversal; dashboard desaparece como modo.

---

## Inventario legacy

| Superficie | Destino post-migración |
|------------|------------------------|
| Centro de Comando `/comando` | MF-08: censo/búsqueda slim → redirect |
| Modo clásico `?mode=classic` | MF-07: congelado → `chartMode=traditional` |
| Dashboard `/epis2/dashboard` | MF-07: congelado; widgets → panel derecho |
| Ficha modern UX-B | MF-03: reemplazada por `ClinicalShell` dual |
| Three-modes switcher | MF-07: deprecar UI |

---

## Fases (ledger v2.0)

| Fase | ID | Estado | Entrega |
|------|-----|--------|---------|
| 0 | MF-DUAL-CHART-00 | DONE | Scaffold + ADR + E2E |
| 1 | MF-DUAL-CHART-01 | DONE | EMR grid + command `/espacio/*` |
| 2 | MF-DUAL-CHART-02 | DONE | Paper SoT + print |
| 3 | MF-DUAL-CHART-03 | **READY** | Router `DualChartPatientPage` |
| 4 | MF-DUAL-CHART-04 | BLOCKED | Shell v2: header, banda, action bar, footer |
| 5 | MF-DUAL-CHART-05 | BLOCKED | TraditionalEhrLayout nav 17 secciones |
| 6 | MF-DUAL-CHART-06 | BLOCKED | PaperChartLayout institucional |
| 7 | MF-DUAL-CHART-07 | BLOCKED | Legacy freeze |
| 8 | MF-DUAL-CHART-08 | BLOCKED | Census-first post-login |
| 9 | MF-DUAL-CHART-09 | BLOCKED | Signoff + invariante #6 |

---

## Automatización

```bash
npm run quality:dual-chart-next
npm run dev:dual-chart:session
npm run quality:dual-chart-plan -- --phase 3 --verify   # fase activa
```

---

## Matriz de tests

| Test | Fases | CI |
|------|-------|-----|
| `three-modes-journey.spec.ts` | 0–9 | Siempre |
| `dual-chart-modes.spec.ts` | 0+ | Opt-in flag |
| Gates MF-04…06 | 4–6 | Cuando componentes existan |

---

## Rollback

`VITE_ENABLE_DUAL_CHART_MODES=false`
