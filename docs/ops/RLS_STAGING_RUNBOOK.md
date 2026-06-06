# EPIS2 — Runbook RLS staging (fail-closed)

**ADR:** ADR-005  
**Microfase:** MF-155  
**Migración:** `database/migrations/022_epis2_rls_pilot.sql`

---

## Objetivo

Garantizar que entornos pre-piloto y producción ejecutan PostgreSQL RLS en modo **enforce** antes de exponer datos clínicos reales.

---

## Rol de base de datos

La API y los tests deben conectar con **`epis2_app`** (`NOBYPASSRLS`). El superusuario `epis2` del contenedor Docker **omite RLS** aunque `FORCE ROW LEVEL SECURITY` esté activo.

Migración: `024_epis2_app_role.sql`.

---

## Variables obligatorias

| Variable | Staging / prod | Dev / test |
|----------|----------------|------------|
| `NODE_ENV` | `production` | `development` o `test` |
| `RLS_MODE` | `enforce` | `off` (default) |

Plantilla: `.env.staging.example`

---

## Despliegue

1. Aplicar migraciones: `npm run db:migrate`
2. Copiar `.env.staging.example` → entorno del host (no commitear secretos).
3. Verificar arranque API: si `NODE_ENV=production` y `RLS_MODE≠enforce`, el proceso **aborta** (fail-closed).
4. Confirmar estado operativo:

```bash
curl -s http://HOST:3001/api/ops/status | jq '.hardening.rlsMode'
# Esperado: "enforce"
```

---

## Verificación local (piloto)

```bash
export NODE_ENV=production
export RLS_MODE=enforce
export DATABASE_URL=postgresql://epis2:epis2@127.0.0.1:5433/epis2
npm run dev -w @epis2/api
```

Tests negativos: `apps/api/src/db/rls.integration.test.ts` (requiere `DATABASE_URL`).

---

## Rollback de emergencia

1. Solo con aprobación de operaciones y registro en auditoría.
2. Establecer `RLS_MODE=off` **y** `NODE_ENV=development` temporalmente, o parche hotfix que restaure enforce.
3. Documentar incidente en reporte de sesión.

---

## Limitaciones conocidas

- Sin modelo multi-tenant; aislamiento por **actor/rol**, no por organización.
- Rutas dashboard, export/longitudinal e IA aún sin `runWithRlsContext` completo (Plan F slice 3+).
- HL7/interop staging tables no participan del piloto RLS clínico.
