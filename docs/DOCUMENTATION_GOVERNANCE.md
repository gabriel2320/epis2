# EPIS2 — Gobierno documental

**Versión:** 1.0 · **Vigente desde:** 2026-06-15 · **Programa:** PROG-CONSOLIDATE ola 2 (MF-CON-03)

Congelamiento: [`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md) · Monorepo: [`MONOREPO_GOVERNANCE.md`](MONOREPO_GOVERNANCE.md)

---

## Propósito

Un solo criterio para agentes, revisores y operadores: **qué documento manda** cuando hay texto distinto o desactualizado.

---

## Jerarquía de verdad

| Prioridad | Documento | Rol |
|-----------|-----------|-----|
| 1 | [`EPIS2_CURRENT_STATE.md`](EPIS2_CURRENT_STATE.md) | **Verdad ejecutiva** — alcance, programas, gates humanos, core intocable |
| 2 | `docs/quality/*-ledger.json` y ledgers de programa | **Verdad granular** por microfase (MF-*) |
| 3 | [`product/EPIS2_TABLERO.md`](product/EPIS2_TABLERO.md) | Índice humano de hilos y entregas (puede rezagarse días) |
| 4 | [`PRODUCT_CANON.md`](PRODUCT_CANON.md) · [`product/PRODUCT_INVARIANTS.md`](product/PRODUCT_INVARIANTS.md) | Principios no negociables |
| 5 | [`README.md`](../README.md) | **Entrada pública breve** — no historial de fases |
| 6 | `docs/product/` · `docs/quality/` | Visión, planes vigentes, gates |
| 7 | [`archive/PHASE_HISTORY.md`](archive/PHASE_HISTORY.md) | Cronología EPIS2-00…12, MUI/M3, planes A–G |
| 8 | [`../reports/README.md`](../reports/README.md) | Índice de reportes de sesión |
| 9 | `reports/archive/` | Auditorías y cierres **históricos** |
| — | `reports/*.md` en raíz de `reports/` | Evidencia de sesiones; **no** estado vigente por defecto |
| — | [`product/EPIS2_COMPLETE_CAPABILITY_MAP.md`](product/EPIS2_COMPLETE_CAPABILITY_MAP.md) | **Histórico** — no usar para decisiones de alcance |

---

## Reglas de resolución de conflictos

1. **README vs `EPIS2_CURRENT_STATE`** → manda **`EPIS2_CURRENT_STATE.md`**.
2. **Tablero vs ledger JSON** → manda el **ledger** del programa (`ficha-first-ledger.json`, `microphase-ledger.json`, etc.).
3. **Reportes vs docs vigentes** → los **reportes son históricos** salvo que el cierre de programa diga explícitamente lo contrario.
4. **Capability Map vs CURRENT_STATE** → manda **CURRENT_STATE**; el mapa completo es inventario histórico.
5. **Agentes Cursor** → leer primero [`AGENT_CONTEXT_MINIMAL.md`](AGENT_CONTEXT_MINIMAL.md) + **CURRENT_STATE**; no usar auditorías antiguas salvo petición.

---

## Qué va en cada zona

| Zona | Contenido | Ejemplos |
|------|-----------|----------|
| **Entrada pública** | Qué es, demo, comandos, seguridad demo | `README.md` |
| **Estado vivo** | Programas, freeze, mapa módulo × acción | `EPIS2_CURRENT_STATE.md`, `CONSOLIDATION_FREEZE.md` |
| **Canon producto** | Invariantes, visión, SDEPIS2 | `PRODUCT_CANON.md`, `EPIS2_DEV_SYSTEM.md` |
| **Operación** | RLS, auth demo, staging | `docs/ops/`, `docs/auth/DEMO_USERS.md` |
| **Histórico fases** | EPIS2-00…12, tracks MUI/M3 | `docs/archive/PHASE_HISTORY.md` |
| **Sesiones / MF** | Cierre microfase, auditoría puntual | `reports/epis2-mf-*.md`, `reports/epis2-prog-*-close*.md` |
| **Archivo** | Reportes movidos, no borrados | `reports/archive/YYYY-MM/` |

---

## Ciclo de vida de un reporte

1. **Crear** en `reports/` al cerrar sesión o MF (convención `epis2-<tema>-<fecha>.md`).
2. **Referenciar** desde tablero o CURRENT_STATE solo si sigue siendo decisión activa.
3. **Archivar** (mover, no borrar) a `reports/archive/YYYY-MM/` cuando:
   - el programa está cerrado y el reporte no define alcance actual, o
   - confunde a agentes (múltiples “planes maestros” simultáneos).
4. **Dejar puntero** en el reporte archivado o en PHASE_HISTORY si aporta contexto.

---

## Documentos prohibidos como fuente de alcance

- Planes EMR completos en `reports/` sin marca de histórico.
- Auditorías de junio 2026 **anteriores** al cierre PROG-CONSOLIDATE ola 2, para decisiones de seguridad (usar código + CURRENT_STATE).
- Copias de estado en README (tablas largas de fases).

---

## Mantenimiento

| Evento | Acción |
|--------|--------|
| Cierre MF-CON-* | Actualizar CURRENT_STATE + tablero |
| Nuevo programa PROG-* | Entrada en CURRENT_STATE + ledger |
| Release tag v0.x | README “Estado real” + PHASE_HISTORY si aplica |
| Conflicto detectado | Corregir doc de **menor** prioridad; no duplicar verdad |

---

## Referencias

| Doc | Uso |
|-----|-----|
| [`INDEX.md`](INDEX.md) | Índice L0…L5 |
| [`epis2-plan-desarrollo-unificado-2026-06-14.md`](../reports/epis2-plan-desarrollo-unificado-2026-06-14.md) | Plan unificado (histórico operativo) |
| [`product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md`](product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md) | Ola 2 consolidación |
