# EPIS2-03 — Autenticación, roles y seguridad

**ID:** EPIS2-03  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Entregables

| Área | Implementación |
|------|----------------|
| Usuarios sintéticos | `packages/clinical-domain/src/demoUsers.ts` |
| RBAC | `permissions.ts` + `rbac.ts` — permisos explícitos por rol |
| Sesión API | JWT en cookie httpOnly (`jose` + `@fastify/cookie`) |
| Rutas auth | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session` |
| Auditoría login | `auth.login.*` en memoria + `GET /api/auth/audit/login` (permiso `audit.read`) |
| Web | `AuthProvider`, login con usuario + clave demo, rutas protegidas vía API |

---

## Gates

| Criterio | ✓ |
|----------|---|
| Permiso por acción (sin `*`) | `rbac.test.ts` |
| Sin contraseñas reales en repo | Claves `DEMO-CLAVE-*` documentadas |
| Rutas protegidas | `beforeLoad` + cookie |
| Auditoría login | append-only memoria |

```bash
npm run check
npm run test
```

---

## Claves demo (laboratorio)

Ver `docs/auth/DEMO_USERS.md`.

---

## Próximo paso

**EPIS2-04** — persistir usuarios, sesiones y auditoría en PostgreSQL.

---

## Commit sugerido

```text
feat(epis2-03): demo auth, RBAC, session cookies, and login audit

Add synthetic users, explicit role permissions, JWT session API,
audit log for auth events, and web AuthProvider with protected routes.
```
