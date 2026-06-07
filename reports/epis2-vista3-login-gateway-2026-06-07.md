# EPIS2 — Vista 3 Login gateway + arco UX command-first

**Fecha:** 2026-06-07 · **Alcance:** `packages/epis2-ui`, `apps/web`

---

## Vista 3 — Login gateway estético

| Entregable | Descripción |
|------------|-------------|
| `EpisAuthScreen` | Gateway full-viewport; panel flotante 16px + `floatingDockShadow`; sin `EpisCard` anidado |
| `LoginPage` | `<form>` nativo + Enter; `epis2-login-gateway`, `epis2-login-form`, `epis2-login-submit` |
| Jerarquía | EPIS2 · tagline · demo badge · usuario · clave · entrar |
| Copy pie | Subtítulo demo + hint en una línea (`labelMedium`) |

**Canon M3 Expressive:** superficie acogedora, acción filled ancho completo, sin ilustraciones ni tableros.

---

## Arco completado (sesión UX)

| Fase | Estado |
|------|--------|
| Vista 1 — Command Center dock + bento | ✅ |
| Vista 2 — Ficha split + dock compact | ✅ |
| UX-C — Quality/ICU planos | ✅ |
| UX-D — Guardar · Firmar · ⋯ | ✅ |
| Vista 3 — Login gateway | ✅ |
| E2E UX-G02 | 3/3 PASS (Parte A: combobox MUI) |

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — **508** tests |
| `npm run db:validate` | OK |
| E2E login gateway | **2/2 PASS** (`e2e/login-gateway.spec.ts`) |

---

## Vista 3 ampliada

- `SessionExpiredPage` y `ForbiddenPage` alineadas al gateway M3 (`EpisAuthScreen`).
- Script: `npm run test:e2e:login-gateway`.

---

## Próximo paso

1. Validación manual: `/login` → entrar → `/comando`.
2. E2E UX-G02 Parte A con `npm run dev` (Playwright levanta API + web).
3. Extender UX-C a tableros Nursing/Service (opcional).
4. Reporte humano CE-0→CE-5 checklist.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
