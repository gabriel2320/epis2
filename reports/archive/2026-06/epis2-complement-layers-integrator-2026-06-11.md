# Complemento layers-integrator — P1 post-captura M3

**Rol:** `layers-integrator` (solo lectura)  
**Fecha:** 2026-06-11  
**Brief:** P1 — revisión humana post-captura M3  
**Evidencia:** `reports/m3-visual-evidence/2026-06-10/` (referenciada; PNG no versionados en repo)

---

## 1. Evidencia M3 (2026-06-10)

| Fuente | Estado |
|--------|--------|
| `epis2-m3-visual-pass-2026-06-10.md` | ✓ PASS auto 16/16 |
| `epis2-ux-audit-visual-2026-06-10.md` | ✓ NO-GO humano |
| Capturas PNG (16) | **No presentes en workspace** — re-captura local o `quality:m3-visual-pass` |

Checklist P1 (hover/foco/rail/two-pane/claro-oscuro): auto PASS en evolución; rail dashboard y signoff estético pendientes revisión humana.

---

## 2. Patrones capas

- **`EpisRadDashboardTabShell`** + **`DashboardPanelGridSection`**: adopción completa solo en ICU y Quality; Nursing/Service/Specialty usan shell RAD pero grids heterogéneos.
- **`EpisDashboardMd3Shell`**: scroll único en main, rail M3-R R4.

---

## 3. Alcance — MF-183 vs alternativa

**MF-183 NO aplica** — DONE (API golden + RLS + censo), no UI capas. Ledger sin microfases READY.

**Alternativa mínima:**

| ID | Tipo | Alcance |
|----|------|---------|
| **P1-HUMAN** | Revisión | 16 PNG + checklist P1 → GO/NO-GO en `epis2-m3-visual-pass-2026-06-10.md` |
| **UX-CALM-DASHBOARD-P1** | Código (si NO-GO dashboard) | Piloto editorial en `ServiceDashboardTab` — hero, ≤3 métricas, censo en `DashboardPanelGridSection` |

---

## 4. Allowlist probable (UX-CALM-DASHBOARD-P1)

```
apps/web/src/components/ServiceDashboardTab.tsx
apps/web/src/components/grids/DashboardPanelGridSection.tsx
apps/web/src/components/rad/EpisRadDashboardTabShell.tsx
apps/web/src/components/dashboard-md3/EpisDashboardMd3Shell.tsx
packages/design-system/src/copy/es.ts
reports/epis2-ux-calm-dashboard-p1-*.md
```

**Prohibido:** API, migraciones, segundo registry, home dashboard, import EPIS sin manifest.

**Gates:** `npm run check` · `quality:ui-simplify-gate` · `quality:layers-integration-gate` · post-fix `quality:m3-human-pilot`.

---

## 5. Próximo paso

1. Humano: revisar PNG locales (o re-capturar).
2. Registrar GO/NO-GO en `epis2-m3-visual-pass-2026-06-10.md`.
3. Si NO-GO dashboard → sesión **UX-CALM-DASHBOARD-P1** en `ServiceDashboardTab`.
4. No usar MF-183 — seguir Hilo C según tablero.

---

## Riesgos

- PNG ausentes en repo impiden signoff remoto.
- Brief desalineado (MF-183 vs P1) — declarar tramo P1/UX-CALM-DASHBOARD.
- Evitar refactor masivo de todos los tabs a `DashboardPanelGridSection`.
