# EPIS2 — Vista 3 ampliada: auth-adjacent gateway

**Fecha:** 2026-06-07 · **Alcance:** `apps/web`, `e2e`, `package.json`

---

## Objetivo

Unificar la experiencia M3 del login gateway en pantallas de frontera de sesión — misma superficie flotante, misma jerarquía tipográfica.

---

## Cambios

| Ruta | Antes | Después |
|------|-------|---------|
| `/sesion-expirada` | `ErrorState` en island | `EpisAuthScreen` + alerta + botón filled |
| `/sin-acceso` | idem | idem |

Test ids: `epis2-session-expired-action`, `epis2-forbidden-action`

---

## E2E nuevo

`e2e/login-gateway.spec.ts` — 2 tests (login + sesión expirada)

```bash
npm run test:e2e:login-gateway
```

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — 508 |
| E2E login + UX-G02 | **5/5 PASS** |
| `npm run db:validate` | OK |

---

## Próximo paso

Commit del arco UX completo o retomar ola producto (`EPIS2_COMPLETION_ROADMAP.md`).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
