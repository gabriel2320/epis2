# MF-FF-01…03 — PROG-FICHA-FIRST (censo + dual chart + /comando compat)

**Programa:** PROG-FICHA-FIRST-2026  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:ficha-first-gate`

## Alcance

| MF | Entrega |
|----|---------|
| **MF-FF-01** | Dual chart ON por default (`VITE_ENABLE_DUAL_CHART_MODES=false` opt-out) |
| **MF-FF-02** | Home clínica = `/espacio/buscar-paciente` (post-login, `/`) |
| **MF-FF-03** | `/comando` → redirect censo / ficha / dashboard (sin `CommandCenterPage`) |

## Flujo

```text
Login → /espacio/buscar-paciente (censo + barra transversal)
     → paciente → /espacio/ficha (clásica | papel)
/comando → redirect compat
```

## Evidencia

| Check | Resultado |
|-------|-----------|
| `command-center-home` architecture gate | ✓ censo-first |
| `router.test.ts` + `dualChartModesEnv.test.ts` | ✓ |
| E2E helper `demoPatient.ts` | ✓ `epis2-census-command-bar` |
| Golden journey home step | ✓ |

## Pendiente (MF-FF-06 READY)

- ClinicalShell en todos los formularios `/espacio/*`
- E2E legacy (`ux-g02`, `three-modes-journey`) aún con `/comando` directo
- Canon `PRODUCT_INVARIANTS.md` / `PRODUCT_CANON.md` (diff mínimo; hacer en MF dedicado)

## Comandos

```bash
npm run quality:ficha-first-gate
npm run dev:rapid -- --skip-audit
```

## Próximo paso

**MF-FF-06** — barra transversal siempre visible en formularios clínicos.
