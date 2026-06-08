# EPIS2 — Auditoría fases, olas y brechas

**Fecha:** 2026-06-04  
**Alcance:** Reconciliación plan global · olas · tramos A–K · capas L3–L5 · microfases MF-151–182 · registry RAD  
**Gates sesión:** `check` ✓ · `db:validate` ✓ (32 migraciones) · `layers-integration-gate` ✓ · `dev-agent-orchestration-gate` ✓ · `quality:microphases` ✓ · `command-palette-gate` ✓ (componente)  
**Tests:** 505/534 pass local sin Postgres `:5433` (29 fallos integración API preexistentes)

---

## 1. Resumen ejecutivo

EPIS2 tiene **arquitectura sana y gates verdes** en la frontera producto (home = Centro de Comando, registries únicos, borrador→aprobación humana). La **Fase A visual (MF-RAD-M3-A + integración L3/L4/L5) está cerrada**. El hilo activo pasa a **Fase B — productividad y completitud Ola 2**.

El **programa de microfases post-MVP (MF-151 → MF-182) está 100 % DONE** en el ledger; no hay MF `READY`. El comando `npm run quality:microphase-next` **falla** (bug: no maneja ledger vacío de pendientes).

**Contradicción documental principal:** varios reportes declaran Tramo J «cerrado técnicamente» mientras el plan global y `radScreenRegistry` mantienen farmacia en `partial` y L6 «bloqueado». La verdad operativa es: **scaffold J ✓ · migración grid farmacia parcial · signoff clínico e integración ERP pendientes**.

**Cobertura catálogo producto:** sigue ~28–35 % del inventario completo (auditoría 2026-06-05); lo entregado concentra demo command-first V0–V5 + tramos scaffold A–K.

---

## 2. Mapa de estado por capa

| Capa | Estado | Evidencia | Brecha |
|------|--------|-----------|--------|
| **L0 Invariantes** | ✓ Permanente | `architecture:validate` 17/17 OK | Ninguna estructural |
| **L1 Olas producto** | Ola 0 ✓ · 1A–1B ✓ · 1C–1D ◐ · Ola 2–3 activas | Golden V0–V5 API (con PG) | Journeys UI Ola 2 incompletos |
| **L2 Tramos A–K** | Scaffold técnico ✓ · Signoff clínico ○ | Reports tramo-*-closure | Datos demo, no producción |
| **L3 UX densidad** | ✓ | `ui-simplify-gate` | — |
| **L4 RAD MD3** | ✓ Fase A dashboard | 9/13 entradas registry `done` | 4 `partial` + 3 tabs sin registry |
| **L5 clinical-productivity** | ✓ Base | Paquete + gates | **Sin cableado en shell web** |
| **L6 Tramo J farmacia** | ◐ Scaffold + partial UI | `PharmacyDashboardTab` RAD parcial | Colas secundarias legacy; ERP |

---

## 3. Olas — faltantes y omitidos

### Ola 0 — Plataforma

| Item | Estado | Notas |
|------|--------|-------|
| CI + Postgres + golden | ✓ | |
| Vitest 4.x upgrade | ○ Omitido | Roadmap lo marca pendiente |
| `npm run test` local sin PG | ◐ Riesgo | 29 tests API fallan ECONNREFUSED :5433 |

### Ola 1 — Milestones 1A–1D

| Milestone | Estado | Faltante principal |
|-----------|--------|-------------------|
| **1A** Shell | ✓ | — |
| **1B** Consulta mínima | ✓ | — |
| **1C** Indicaciones/resultados | ◐ | Bandeja ✓; órdenes/imagen parcial |
| **1D** IA asistida | ◐ | Assist route ✓; cobertura journey parcial |
| **CE** Command Engine | ✓ | CE-0→CE-5 |

**Omitidos menores (roadmap):** historial comandos UI · comparación versiones borrador · WIDGET-01 densidad en comando (montado pero no maximizado).

### Ola 2 — Atención médica (ACTIVA)

| Capacidad | Registry/API | UI/Journey | Gap |
|-----------|--------------|------------|-----|
| Ingreso hospitalario | ✓ `admission_note` MF-157 | Ruta `/espacio/ingreso` | Journey humano E2E ingreso→alta incompleto en UI |
| Ambulatorio | ✓ `outpatient_visit` | Scrollspy ✓ | Profundidad clínica limitada |
| Traslado | ✓ `transfer_note` | Form ✓ | — |
| Certificado | ✓ `medical_certificate` MF-032 DB | Form ✓ | Impresión 6A parcial |
| Procedimiento | ○ | — | Sin blueprint |
| Cierre encuentro | ◐ | API demo | UI operativa incompleta |

**19 blueprints** registrados (vs ~11 en auditoría jun-05) — **progreso no reflejado** en `EPIS2_COMPLETION_ROADMAP.md` v1.2.

### Ola 3 — Longitudinal

| Capacidad | Estado |
|-----------|--------|
| Ficha hub split pane | ✓ |
| Results inbox grid | ✓ MF-RAD-M3-A |
| CTAs alergia/problema | ◐ Blueprints ✓ · CTAs vacíos parcial |
| Documentos UI | ◐ API ✓ · pantallas limitadas |

### Olas 4–8+ (Post-core demo)

Scaffold tramos B–K con tabs dashboard; **signoff clínico institucional pendiente** en todos.

---

## 4. Fases del plan global (`EPIS2_GLOBAL_DEV_PLAN.md`)

| Fase | Estado real | Pendiente |
|------|-------------|-----------|
| **A** Consolidación visual | **CERRADA** | Solo item B movido aquí: palette |
| **B** Ola 2 + productividad | **ACTIVA** | `ClinicalCommandPalette` Ctrl+K en `EpisAppScaffold` · autocomplete búsqueda paciente |
| **C** Ola 3 longitudinal | Parcial | CTAs · documentos UI |
| **D** Tramo J densidad | Bloqueada por criterio producto | `dashboard-pharmacy` → `done` + signoff UX-G02 |

---

## 5. Registry RAD (`radScreenRegistry.ts`) — brechas

| ID | migration | Problema |
|----|-----------|----------|
| `patient-search` | partial | Sin `ClinicalDataGrid` / autocomplete L5 |
| `clinical-form-evolution` | partial | Acordeones ✓ · falta cierre discipline audit |
| `draft-review` | partial | Revisión documental sin cierre RAD |
| `dashboard-pharmacy` | partial | Grids principales ✓ · paneles Y-Site/TDM/RAM en acordeón sin bulk homogéneo |
| **Ausentes del registry** | — | `reception`, `aps`, `or` tabs (listas legacy, fuera Fase A) |

**Tabs dashboard migrados RAD (done):** work, service, nursing, emergency, icu, specialty, patient, quality.

**Tabs sin migrar RAD:** reception, aps, or — usan `List`/`Chip`, no `EpisRadDashboardTabShell`.

---

## 6. Microfases MF-151–182

| Métrica | Valor |
|---------|-------|
| Total microfases | 38 |
| DONE | 38 |
| READY / IN_PROGRESS | 0 |
| Última MF | MF-182 HL7 writeback controlado |

**Implicación:** el motor de microfases post-MVP está **agotado**. Nuevo trabajo debe registrarse como:
- MF-UI-07 Command palette shell (propuesto), o
- Continuación directa Fase B en plan global + reporte de sesión.

**Bug omitido:** `scripts/quality/microphase-next.mjs` lanza `TypeError` cuando `next === null`.

---

## 7. Dev agents / Ollama

| Item | Estado |
|------|--------|
| `npm run dev:session` | ✓ |
| Subagentes 8 roles | ✓ |
| `dev-agent-orchestration-gate` | ✓ |
| Ollama plan JSON | ◐ Puede sugerir MF ya cerradas — prompt corregido parcialmente |

**Riesgo:** mezclar planificación Ollama dev con escritura clínica SoT — mantener separación documentada.

---

## 8. Faltantes (priorizados)

### P0 — Siguiente sprint Fase B

1. **Integrar `ClinicalCommandPalette` en `EpisAppScaffold`** — componente L5 existe; cero imports en `apps/web`.
2. **Autocomplete paciente** en búsqueda (`patient-search` → `done`).
3. **Actualizar `EPIS2_COMPLETION_ROADMAP.md`** — conteos tests/blueprints desactualizados.

### P1 — Cierre Ola 2

4. Journey UI `golden-v2-admission-discharge` humano (Playwright borrador ingreso→alta).
5. Procedimiento clínico — blueprint + comando.
6. Cierre encuentro operativo UI.

### P2 — RAD residual

7. Completar `dashboard-pharmacy` → `done` (Tramo J criterio plan global).
8. Migrar reception / aps / or a patrón RAD o documentar exclusión explícita (tramos clínicos, no dashboard rol core).
9. Cerrar `draft-review` y `clinical-form-evolution` en registry.

### P3 — Post-core

10. Admin/usuarios UI (~5 % catálogo).
11. Vitest 4.x.
12. Signoff clínico tramos A–K institucional.

---

## 9. Omitidos (documentados pero no ejecutados)

| # | Omitido | Dónde se dice | Realidad |
|---|---------|---------------|----------|
| O1 | Command palette en shell | Plan global Fase A/B, 6+ reportes | Solo paquete L5 |
| O2 | Tramo J «bloqueado» vs «cerrado» | Plan global vs tramo-j-closure | Scaffold cerrado; producto partial |
| O3 | L6 bloqueado hasta layers gate | EPIS2_UI_LAYERS | Gate ✓ desde 2026-06-07 — texto obsoleto |
| O4 | MF-RAD-M3-A como siguiente | Ollama plan histórico | Fase A cerrada |
| O5 | microphase-next operativo | AGENTS / dev:session | Crash sin MF READY |
| O6 | 511 tests en roadmap | COMPLETION_ROADMAP | 534 tests actuales |
| O7 | Ingreso sin blueprint | gap-audit 2026-06-05 B2 | **Corregido** MF-157 — doc no actualizada |
| O8 | Workspace `emergency` rail | Wave canon | IDC urgencias en tab dashboard, no rail dedicado |

---

## 10. Riesgos

| ID | Riesgo | Severidad | Mitigación |
|----|--------|-----------|------------|
| R1 | Tests integración sin PG en dev | Media | `DATABASE_URL` :5433 documentado; `quality:ci-parity` |
| R2 | Declarar tramos «cerrados» sin signoff clínico | Alta | Separar «scaffold técnico» vs «piloto GO» |
| R3 | Duplicación L4/L5 (`@mui/x-data-grid` en pantallas) | Media | Gate layers + PR review |
| R4 | Dashboard compite con comando | Media | UX-G02 E2E ✓; palette refuerza comando |
| R5 | Farmacia demo vs ERP real | Alta | No piloto producción sin integración |
| R6 | Ledger MF vacío → agentes sin norte | Media | Fase B explícita en plan + fix microphase-next |
| R7 | Documentación divergente (3 fuentes fechas) | Baja | Sync plan global v1.2 + este reporte |

---

## 11. Gates verificados esta sesión

```bash
npm run check                              # OK
npm run db:validate                        # OK — 32 migraciones
npm run quality:layers-integration-gate    # OK
npm run quality:dev-agent-orchestration-gate  # OK
npm run quality:microphases                # OK — 38/38 DONE
npm run quality:command-palette-gate       # OK — componente; no wiring web
npm run test                               # 505 pass / 29 fail (sin PG)
```

---

## 12. Próximo paso exacto (recomendado)

```text
Sesión Fase B-01
  1. npm run dev:session
  2. Cablear ClinicalCommandPalette + useClinicalCommandPaletteShortcut en EpisAppScaffold
  3. Items desde command-registry (maxVisible, confirmación riesgo)
  4. Gate: quality:command-palette-gate + test EpisAppScaffold
  5. Autocomplete patient-search (ClinicalDataGrid / L5)
  6. Reporte reports/epis2-fase-b-command-palette-*.md
```

**No iniciar** densidad farmacia Tramo J completa hasta palette + búsqueda (canon olas: productividad antes de J).

---

## 13. Sincronización documental aplicada

- `docs/product/EPIS2_GLOBAL_DEV_PLAN.md` → v1.2 (Fase A cerrada, L6 reconciliado, post-MF ledger)
- `scripts/quality/microphase-next.mjs` → manejo graceful sin MF READY

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
