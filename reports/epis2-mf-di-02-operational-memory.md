# MF-DI-02 — Memoria operacional por usuario

**Fecha cierre:** 2026-06-11 · **Programa:** PROG-DETERMINISTIC-INTELLIGENCE-2026  
**Gate:** `npm run quality:di-memory-gate` ✓ · `npm run check` ✓

---

## Alcance

Preferencias determinísticas por usuario en PostgreSQL: última sección tradicional por paciente, pacientes recientes, favoritos de blueprint — sin IA. RLS por `epis2.actor_id` en modo enforce.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `044_user_operational_memory.sql` | Tabla `user_operational_memory` + RLS |
| `user/operationalMemory.ts` | GET/PATCH API + touch recientes |
| `useOperationalMemory.ts` | Hook React Query en ficha dual |
| `recentPatients.ts` | Sync best-effort a servidor + cache sessionStorage |
| `TraditionalEhrMode` | Restaura y persiste `traditionalSection` |
| `quality:di-memory-gate` | Gate MF-DI-02 |

## API

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/user/operational-memory?patientId=` | Leer global + estado paciente |
| PATCH | `/api/user/operational-memory?patientId=` | Guardar sección / favoritos |
| POST | `/api/user/operational-memory/recent-patients` | Registrar paciente reciente |

## Gates

```bash
npm run quality:di-memory-gate
npm run check
npm run db:validate
```

## Próximo paso

**MF-DI-03** — Autocompletado con ranking de frecuencia (`npm run quality:di-next`).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
