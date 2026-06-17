# EPIS2 — Brief sesión PROG-DUAL-CHART

> Generado: 2026-06-11 · `npm run dev:dual-chart:session`

## Alcance SDEPIS2

| Campo | Valor |
|-------|-------|
| Programa | PROG-DUAL-CHART |
| Fase | **MF-DUAL-CHART-03** — Router switch chartMode en /espacio/ficha |
| ADR | [ADR-002](docs/adr/ADR-002-dual-chart-modes.md) |
| Estado ledger | READY |

## Objetivo único de sesión

- [ ] DualChartPatientPage detrás de isDualChartModesEnabled()
- [ ] Default chartMode=traditional
- [ ] E2E /espacio/ficha
- [ ] npm run quality:dual-chart-router-gate

## Archivos permitidos

```text
apps/web/src/pages/DualChartPatientPage.tsx
apps/web/src/pages/PatientWorkspacePage.tsx
apps/web/src/routes/router.tsx
```

## Prohibido esta sesión

- Segundo registry temporal
- Import EPIS sin manifest
- Romper `three-modes-journey.spec.ts`
- `@mui/*` directo desde apps/web
- IA que apruebe o firme

## Comandos automatizados

```bash
npm run stack:dev                    # una vez al día
npm run dev:dual-chart:session       # este brief
npm run quality:dual-chart-next      # JSON fase activa
npm run quality:dual-chart-plan -- --phase 3 --verify
VITE_ENABLE_DUAL_CHART_MODES=true npm run dev:web
# Preview: http://localhost:5173/dev/chart-modes

# Cierre fase (cuando gate pase):
npm run quality:dual-chart-plan -- --phase 3 --verify --e2e --legacy
npm run dev:agent:close
```

## Referencias Figma

- [Ficha electrónica tradicional](https://www.figma.com/make/PhZ55jJhxLQUtIWEuf17ZO/Medical-Record)
- [Ficha papel editable](https://www.figma.com/make/AJ9MNrSyClA0hh8jB8sx49/Crear-p%C3%A1ginas-de-ficha-m%C3%A9dica)

## Rollback

`VITE_ENABLE_DUAL_CHART_MODES=false` — cero impacto rutas legacy.

## Cierre

Reporte: `reports/epis2-mf-dual-chart-03-router.md`

Actualizar `docs/quality/dual-chart-ledger.json`: marcar DONE → siguiente READY.
