# EPIS2 — Ola 1 núcleo shell (core-shell)

**Fecha:** 2026-06-05  
**Rama lógica:** `epis2-ola1-core-shell`  
**Alcance:** Cerrar brechas Ola 1 sin nuevos dominios clínicos.

---

## 1. Entregables

| # | Entregable | Estado |
|---|------------|--------|
| 1 | WIDGET-01 en Comando y ficha | ✓ Ya montado; documentado en `SCOPE_V1.md` |
| 2 | Pantalla sesión expirada `/sesion-expirada` | ✓ |
| 3 | Pantalla acceso unificado `/sin-acceso` | ✓ |
| 4 | Redirect 401 en `apiFetch` | ✓ |
| 5 | Microcopy IA sin «Ollama» en UI clínica | ✓ `copy/es.ts`, `chips.ts` |
| 6 | Deep-link tabs `nursing`/`pharmacy` en router | ✓ `validateSearch` |
| 7 | Addendum WIDGET-01 en `SCOPE_V1.md` | ✓ |

---

## 2. Archivos tocados

- `packages/design-system/src/copy/es.ts`
- `packages/command-registry/src/chips.ts`
- `apps/web/src/routes/router.tsx`
- `apps/web/src/routes/clinicalNavigate.ts`
- `apps/web/src/api/client.ts`
- `apps/web/src/auth/sessionRedirect.ts`
- `apps/web/src/pages/SessionExpiredPage.tsx`
- `apps/web/src/pages/ForbiddenPage.tsx`
- `apps/web/src/pages/CommandCenterPage.tsx`
- `apps/web/src/pages/GeneratedClinicalFormPage.tsx`
- `docs/SCOPE_V1.md`
- Tests nuevos: `SessionExpiredPage.test.tsx`, `ForbiddenPage.test.tsx`, `client.test.ts`, `sessionRedirect.test.ts`

---

## 3. Gates

```bash
npm run check
npm run test
npm run db:validate
```

---

## 4. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Redirect 401 en tests paralelos | Flag idempotente + reset en tests |
| 403 en comando navega fuera | Usuario vuelve con botón explícito |
| Nomenclatura rutas canónicas | Sigue DEFERRED |

---

## 5. Próximo paso

**Ola 2 — Atención médica:** blueprint ingreso hospitalario + comando `haz ingreso` → formulario (rama `epis2-ola2-admission-blueprint`).
