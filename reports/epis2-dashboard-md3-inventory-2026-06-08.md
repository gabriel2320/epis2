# EPIS2 — Inventario Dashboard (MF-DASHBOARD-MD3)

**Fecha:** 2026-06-08  
**Alcance:** `/epis2/dashboard` antes de Modo Dashboard MD3

## Tabs existentes

| Tab | Componente | Estado |
|-----|------------|--------|
| work | DashboardWorklists + EpisMetric | Activo |
| patient | PatientDashboardTab | Activo |
| service | ServiceDashboardTab | Activo |
| nursing | NursingDashboardTab | Activo |
| pharmacy | PharmacyDashboardTab | Activo |
| quality | QualityDashboardTab | Activo |
| reception | ReceptionDashboardTab | Parcial |
| emergency | EmergencyDashboardTab | Parcial |
| icu | IcuDashboardTab | Parcial |
| or | OrDashboardTab | Parcial |
| aps | ApsDashboardTab | Parcial |
| specialty | SpecialtyDashboardTab | Parcial |

## Hallazgos

| Problema | Ubicación | Acción MD3 |
|----------|-----------|------------|
| 12 tabs visibles sin agrupación | EpisDashboardShell tabs | Navigation rail ≤7 + “Más” |
| EpisMetric cards sin acción KPI clara | work tab | KPI strip accionable |
| EpisAppScaffold + nested workspace | DashboardModeContent | Shell 100dvh dedicado |
| Sin scope bar fija | — | EpisDashboardMd3ScopeBar |
| Sin detail pane | — | EpisDashboardMd3DetailPane |
| Sin command bar contextual | — | EpisDashboardMd3CommandBar |
| Chips pacientes recientes (cards) | work tab | Mantener compacto bajo KPI |
| Grillas parciales | Pharmacy/Nursing tabs | EpisDashboardMd3MainGrid wrapper |
| Bulk actions | WorklistDraftGrid, pharmacy | EpisBulkActionMenu (existente) |
| Home = comando ✓ | router | Sin cambio |
| Dashboard no es home ✓ | architecture gate | Sin cambio |

## Cards vs grillas

- **Mantener cards:** KPI strip (4–6 máx.), no más de 6 EpisMetric en work.
- **Preferir grillas:** borradores, pendientes, colas farmacia/enfermería, censo servicio.

## Acciones duplicadas

- `goCommand` + chips “Usar en comando” — OK (no duplica ActionBar clínica).
- Tabs + side nav — duplicación navegacional; MD3 rail reemplaza tabs horizontales en modo dashboard.

## Próximo paso

Activar shell MD3 con `?mode=dashboard` sin eliminar layout legacy sin `mode`.
