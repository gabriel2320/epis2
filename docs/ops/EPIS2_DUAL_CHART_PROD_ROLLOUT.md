# EPIS2 — Runbook activación dual chart en producción (C-4)

**ADR:** ADR-002 · **Entrega:** C-4 · **Signoff previo:** C-2 GO · staging validado

---

## Pre-requisitos

| Gate | Comando |
|------|---------|
| Ledger dual chart | `npm run quality:dual-chart-gate` |
| E2E dual | `VITE_ENABLE_DUAL_CHART_MODES=true npm run test:e2e:dual-chart` |
| Check | `npm run check` |
| Signoff Calm | `reports/archive/2026-06/epis2-entrega-c2-calm-premium-2026-06-11.md` |

---

## Activación

1. Copiar `.env.production.example` → secreto de despliegue (no commitear).
2. Establecer `VITE_ENABLE_DUAL_CHART_MODES=true` en build del frontend.
3. Rebuild y desplegar `@epis2/web` con variable en tiempo de build Vite.
4. Verificar post-deploy:
   - Login → `/espacio/buscar-paciente` (barra censo)
   - Abrir ficha → `chartMode=traditional` por defecto
   - Switch traditional ↔ paper sin perder `patientId`
   - Ctrl+K abre paleta (`epis2-clinical-command-palette`)

---

## Rollback (inmediato)

```bash
VITE_ENABLE_DUAL_CHART_MODES=false
```

Rebuild frontend. Rutas legacy three-modes siguen operativas; CI `three-modes-journey` no depende del flag.

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| E2E legacy esperan workspace clásico | Flag off restaura comportamiento previo |
| Usuarios sin training dual | Comunicar switch en barra clínica |
| Prod sin variable | Default prod = off si omitida (no DEV) |

---

## Evidencia cierre C-4 prod

Reporte: `reports/epis2-entrega-c4-prod-YYYY-MM-DD.md` con commit, URL y capturas opcionales.
