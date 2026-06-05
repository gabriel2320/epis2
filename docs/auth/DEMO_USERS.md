# Usuarios demo sintéticos (EPIS2-03)

**No son credenciales de producción.** Claves públicas de laboratorio.

| Usuario | Clave demo |
|---------|------------|
| `medico.demo` | `DEMO-CLAVE-MEDICO` |
| `enfermeria.demo` | `DEMO-CLAVE-ENFERMERIA` |
| `farmacia.demo` | `DEMO-CLAVE-FARMACIA` |
| `admin.demo` | `DEMO-CLAVE-ADMIN` |
| `auditor.demo` | `DEMO-CLAVE-AUDITOR` |

Fuente canónica: `packages/clinical-domain/src/demoUsers.ts`

## Auth híbrida piloto (ADR-006)

Para integraciones sin login interactivo:

```bash
AUTH_MODE=hybrid
SERVICE_API_KEY=<clave-min-32-caracteres>
```

Header: `X-EPIS2-Service-Key: <clave>` → sesión auditor read-only (`usr-auditor-01`).

**No usar en producción con PHI real** — sustituir por OIDC (ADR-006 completo).

## RLS piloto (ADR-005)

```bash
RLS_MODE=enforce   # default: off
```

Con `enforce`, las rutas clínicas de borradores/pacientes aplican `SET LOCAL` en transacción PostgreSQL.
