# EPIS2 — UX-A progreso

**Fecha:** 2026-06-04 · **Acta:** `epis2-ux-ui-audit-2026-06-04.md`  
**Estado:** UX-A completado · contrato UX-B en `docs/design/EPIS2_UX_B_INFORMATION_ARCHITECTURE.md`

---

## Completado

### Slice 1 (shell + router)

| Ítem | Entregable |
|------|------------|
| Fix router 12 tabs | `DASHBOARD_TABS` + `parseDashboardSearch()` |
| AppBar sticky | `ClinicalGlobalTopBar` · `EpisAppShellLayout.appBar` |
| Comando plano | `EpisCommandCenterLayout` · `epis2ShellContentSx` |
| LAYOUT-G12 | `scripts/architecture/layout-g12-gate.mjs` |

### UX-A.1 — Quick actions → Comando ✅

| Ítem | Entregable |
|------|------------|
| Cobertura intents | `register_allergy`, `register_problem` + aliases naturales |
| Mapa ficha → comando | `WORKSPACE_QUICK_ROUTE_INTENTS` |
| Power Bar en ficha | `PatientWorkspaceCommandPanel` |
| Retiro botonera | Grid ~19 botones eliminado de `PatientWorkspacePage` |

### UX-A.2 — Flatten Dashboard Shell ✅

| Ítem | Entregable |
|------|------------|
| Shell plano | `EpisDashboardShell` sin isla ni cajas `border: 1` |
| Gate LAYOUT-G12 | Validación dashboard en `layout-g12-gate.mjs` |

### UX-A.3 — AppBar operativa real ✅

| Ítem | Entregable |
|------|------------|
| 5 acciones | Buscar · Comando · Paciente · Alertas · Usuario |
| Alertas / Usuario | `ClinicalAppBarAlertsAction` · `ClinicalAppBarUserMenu` |
| Tablero unificado | `DashboardModeContent` + misma AppBar global |

### UX-A.4 — Casos demo narrativos ✅

| Ítem | Entregable |
|------|------------|
| Episodios piloto | `packages/test-fixtures/src/demoNarratives.ts` (5 relatos) |
| Mapeo DEMO-00x | IAM→001, pie→002, neumonía→004, IC+bacteriemia→005 |
| UI Centro de Comando | `DemoNarrativeWalkthroughPanel` — fija paciente + comando sugerido |
| Presentación | `PatientListGrid` episodio · `ActivePatientBanner` · `ClinicalPatientChartChrome` |
| Escenarios fixtures | `demoCases.ts` — copy alineado a narrativa (sin cambiar UUID) |
| Tests | `demoNarratives.test.ts` · golden journey · `CommandCenterPage.test` |
| Gate 30s | Comando sugerido resuelve vía `resolveCommand` por episodio |

**Episodios:**

| Episodio | DEMO | Comando sugerido |
|----------|------|------------------|
| IAM en evaluación | DEMO-001 | `solicitar tac` |
| Interconsulta cardiología | DEMO-005 | `hacer interconsulta cardiologia` |
| Neumonía grave | DEMO-004 | `crear evolucion` |
| Pie diabético | DEMO-002 | `consulta ambulatoria` |
| Bacteriemia | DEMO-005 | `abrir farmacia` |

DEMO-003 (asma pediátrica) permanece en catálogo; no es relato piloto principal.

---

## Contrato UX-B (sin implementar)

Documento: `docs/design/EPIS2_UX_B_INFORMATION_ARCHITECTURE.md`

| Gate | Objetivo |
|------|----------|
| UX-G01 | Home = Power Bar + 4 bloques |
| UX-G02 | Ficha Resumen compacta |
| UX-G03 | Formulario Guardar · Firmar · ⋯ |
| UX-G04 | Rail ≤5 nodos mentales |
| UX-G05 | LAYOUT-G12 extendido |

**Próxima implementación:** UX-B.1 home comando compacto.

---

## Gates (sesión UX-A completa)

```bash
npm run check          # OK
npm run test           # OK
npm run db:validate    # OK
```

---

## Riesgos

- DEMO-005 comparte dos relatos (IC y bacteriemia) — chip «primario» muestra IC; walkthrough distingue ambos.
- Narrativa en fixtures ≠ enriquecimiento completo de seeds (órdenes, timeline) — fase posterior UX-B/C.
- Panel demo en Comando añade scroll — UX-B.1 colapsará widgets secundarios.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
