# EPIS2 — Registro de decisiones de licencia MUI X

**Fase:** EPIS2-MUI-00 · Actualizar antes de usar cualquier feature Pro o Premium.

MUI X Community es gratuito (MIT). Data Grid, Charts y otras familias incluyen capacidades **Pro** y **Premium** con licencia comercial. Scheduler es producto relativamente nuevo: verificar términos vigentes en [mui.com/pricing](https://mui.com/pricing) al momento de adopción.

---

## Política EPIS2

1. **Predeterminado:** solo APIs y componentes **Community**.
2. **Pro/Premium:** requiere fila en esta tabla con estado `APPROVED` y responsable.
3. **Spike Pro:** permitido en rama corta `/dev/*` sin merge a `main` sin aprobación.
4. **CI:** validador futuro `no-mui-premium-without-license` (MUI-11).

---

## Decisiones registradas

| ID | Fecha | Producto MUI X | Feature / tier | Estado | Caso EPIS2 | Responsable | Notas |
|----|-------|----------------|----------------|--------|------------|-------------|-------|
| LIC-001 | 2026-06-04 | Data Grid | Community (base) | `APPROVED` | Worklists, pacientes, lab, calidad | EPIS2-MUI-05 | `EpisDataGrid` Community |
| LIC-002 | 2026-06-04 | Data Grid | Row grouping (Pro) | `REJECTED` | — | — | Sin necesidad V1–V5 |
| LIC-003 | 2026-06-04 | Data Grid | Excel export (Premium) | `REJECTED` | — | — | Export vía API/FHIR, no grid |
| LIC-004 | 2026-06-04 | Date Pickers | Community | `APPROVED` | Encuentro, órdenes lab/imagen | EPIS2-MUI-06 | `EpisDatePicker` + dayjs `es` |
| LIC-005 | 2026-06-04 | Charts | Community | `APPROVED` | INR DEMO-005, FC, KPI servicio | EPIS2-MUI-07 | `EpisTrendChart` Community |
| LIC-006 | 2026-06-04 | Tree View | Community | `APPROVED` | Documentos, navegación longitudinal | EPIS2-MUI-08 | `EpisTreeView` Community |
| LIC-007 | 2026-06-04 | Scheduler | Community alpha v9 (`EventCalendar`) | `EVALUATE` | Agenda hospitalaria | EPIS2-MUI-10 | Spike `/dev/scheduler-spike`; peer MUI 7+ vs stack MUI 6; sin API Appointment; Premium = recurrencia/timeline |
| LIC-008 | 2026-06-04 | Material UI Core | MIT (open) | `APPROVED` | Todo el frontend | Arquitectura | Ya en uso |

---

## Plantilla para nuevas entradas

```markdown
| LIC-0XX | YYYY-MM-DD | <producto> | <feature/tier> | PENDING / APPROVED / REJECTED | <caso> | <nombre> | <enlace pricing, costo, alternativa Community> |
```

---

## Alternativas si se rechaza licencia de pago

| Necesidad | Alternativa Community / propia |
|-----------|--------------------------------|
| Agrupación compleja en grid | Agrupar en API + varias vistas |
| Export Excel | Endpoint export CSV/JSON auditado |
| Scheduler Pro | Vista lista + DatePicker hasta LIC-007 aprobado |
| Sparklines en celdas | Columna render custom sin Premium |

---

## Material Icons

- Paquete `@mui/icons-material`: MIT.
- Importar iconos individualmente; no barrel de cientos de iconos.
- Material Symbols (sucesor) no está empaquetado en `@mui/icons-material`; **EVALUATE** SVG propios solo si gap clínico real.

---

## Revisión periódica

- Antes de cada release piloto: revisar dependencias `package-lock.json` por paquetes `@mui/x-*`.
- Al subir major version MUI: releer breaking changes y licencias.

---

## Referencias

- `docs/design/MUI_X_ADOPTION_PLAN.md`
- `docs/design/MUI_CAPABILITY_MAP.md`
