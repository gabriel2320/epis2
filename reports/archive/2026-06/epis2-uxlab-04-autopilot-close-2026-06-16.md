# MF-UXLAB-04 — UX-LAB Autopilot fase A (audit-only)

**Fecha:** 2026-06-16 · **Programa:** PROG-UX-LAB · **Tramo:** D tooling  
**Plan:** [`EPIS2_UX_LAB_MODERN_PLAN.md`](../docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md)

---

## Alcance

Bot autónomo **audit-only**: preflight + gates light + Playwright Modo A + reporte `GO-CANDIDATE` / `NO-GO`. Sin merge, tag ni autocorrección clínica.

---

## Entregables

| Item | Ruta |
|------|------|
| Orquestador | `tools/ux-lab-autopilot/` |
| E2E walkthrough | `e2e/ux-lab-autopilot-mode-a.spec.ts` |
| Gate | `quality:ux-lab-autopilot` en catálogo |
| Artefactos | `reports/ux-lab-autopilot/` |

---

## Verificación local

```bash
npm run quality:gate -- quality:ux-lab-autopilot
```

| Check | Resultado |
|-------|-----------|
| Preflight (script diet, catálogo) | ✓ |
| `root-script-surface-gate` | ✓ |
| Playwright Modo A | ✓ |
| BOT VERDICT | GO-CANDIDATE |
| UX-BLOCKER | 0 |

**Prerrequisito:** `npm run stack:dev` recomendado (API + Postgres).

---

## Diferido (fases B–D)

- `self-heal-safe` (prettier acotado, repair loop)
- `pr-candidate` (rama + commit + PR opcional)
- Tier full con `quality:ux-lab-close` en nightly

---

## Criterio MF

| Criterio | Estado |
|----------|--------|
| Bot audit-only sin root package.json | ✓ |
| No merge / no rc4 | ✓ |
| Señales demo críticas en walkthrough | ✓ |
| Reporte con frase no-rc4 | ✓ |

**PASS** — fase A MF-UXLAB-04.

---

*Este reporte no autoriza rc4. Requiere signoff humano explícito.*
