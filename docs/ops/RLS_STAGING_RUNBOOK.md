# EPIS2 — Runbook RLS staging (fail-closed)

**ADR:** ADR-005  
**Microfases:** MF-155 · **MF-SH-05**  
**Migraciones:** `022_epis2_rls_pilot.sql` · `023_epis2_rls_force.sql` · `024_epis2_app_role.sql`

---

## Objetivo

Garantizar que entornos pre-piloto y producción ejecutan PostgreSQL RLS en modo **enforce** antes de exponer datos clínicos reales, con **FORCE ROW LEVEL SECURITY** activo para el owner de tabla.

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
| `EPIS2_RLS_FORCE` | `1` (operador) | opcional / omitir |
| `DATABASE_URL` | `postgresql://epis2_app:…` | `epis2_app` recomendado |

Plantillas: `.env.staging.example` · `.env.production.example`

### `EPIS2_RLS_FORCE`

Flag **documental/operacional** (no sustituye `RLS_MODE=enforce`). El operador lo fija en `1` tras confirmar:

1. `npm run db:migrate` aplicó `023_epis2_rls_force.sql`
2. `epis2_schema_meta.version = epis2-rls-force`
3. Tablas piloto con `FORCE ROW LEVEL SECURITY` (`clinical_drafts`, `clinical_notes`, `patients`)

La API sigue validando fail-closed vía `RLS_MODE=enforce` cuando `NODE_ENV=production`.

---

## Despliegue

1. Aplicar migraciones: `npm run db:migrate`
2. Verificar migración force:

```bash
npm run db:validate
# o inspección manual epis2_schema_meta + \d+ patients
```

3. Copiar `.env.staging.example` o `.env.production.example` → entorno del host (no commitear secretos).
4. Confirmar:

```bash
EPIS2_RLS_FORCE=1
RLS_MODE=enforce
DATABASE_URL=postgresql://epis2_app:SECRET@db-host:5432/epis2
```

5. Verificar arranque API: si `NODE_ENV=production` y `RLS_MODE≠enforce`, el proceso **aborta** (fail-closed).
6. Confirmar estado operativo:

```bash
curl -s http://HOST:3001/api/ops/status | jq '.hardening.rlsMode'
# Esperado: "enforce"
```

---

## Smoke staging C-4 (dual chart + RLS)

Ejecutar tras RLS enforce en staging, con dual chart activo (Entrega C-4):

| Paso | Comando / check | Esperado |
|------|-----------------|----------|
| 1 | `curl …/api/ops/status` → `hardening.rlsMode` | `"enforce"` |
| 2 | Build web con `VITE_ENABLE_DUAL_CHART_MODES=true` | flag on |
| 3 | Login demo → abrir ficha paciente | modos tradicional/papel visibles |
| 4 | E2E opt-in | `npm run test:e2e:dual-chart` |

Documentación C-4: `docs/ops/EPIS2_DUAL_CHART_PROD_ROLLOUT.md` · reporte `reports/epis2-mf-te-01-c4-staging.md`

---

## Verificación local (piloto)

```bash
export NODE_ENV=production
export RLS_MODE=enforce
export EPIS2_RLS_FORCE=1
export DATABASE_URL=postgresql://epis2_app:epis2@127.0.0.1:5433/epis2
npm run dev -w @epis2/api
```

Tests negativos: `apps/api/src/db/rls.integration.test.ts` (requiere `DATABASE_URL` con `epis2_app`).

Gate MF-SH-05: `npm run quality:sh-05-rls-gate`

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
