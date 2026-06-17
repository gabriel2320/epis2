# EPIS2 — Cierre sesión CICA Clean Room Redesign

**Fecha:** 2026-06-11 · **Rama:** `feat/prog-aesthetic-reset-close` @ `594daf5`  
**Programa:** CICA Clean Room · olas 1–6 (shell, páginas, formularios, redirects, tema/responsive, E2E)

---

## Alcance

Interfaz clínica **sala blanca** bajo `/app/*` con `VITE_ENABLE_CICA_UI=true` (default ON). Legacy `/espacio/*` dona datos/contratos; redirecciones cuando CICA activo. Sin importar shell legacy en `apps/web/src/cica/`.

**Entregas principales:**

| Área | Archivos / artefactos |
|------|------------------------|
| UI package | `packages/epis2-ui/src/cica/*` — shell, frames, registries, tema, motion, grid |
| Web app | `apps/web/src/cica/*` — 12+ rutas clínicas, hooks, layout |
| Redirects | `apps/web/src/routes/*` — PR6 mapeo legacy → CICA |
| Gates | `quality:cica-*` (7 gates + composite close) |
| E2E | `e2e/cica-*.spec.ts` (journey, drafts, theme) |
| Docs | `docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md` |
| Reportes | `reports/epis2-cica-*-2026-06-*.md` |

Evidencia detallada: [`epis2-cica-theme-responsive-2026-06-17.md`](./epis2-cica-theme-responsive-2026-06-17.md) · [`epis2-cica-clean-room-redesign-2026-06-17.md`](./epis2-cica-clean-room-redesign-2026-06-17.md)

---

## Gates sesión

| Gate | Resultado |
|------|-----------|
| `quality:cica-clean-room-close-gate` | ✓ |
| `quality:cica-theme-gate` | ✓ |
| `quality:cica-responsive-gate` | ✓ |
| `npm run check` | ✓ (lint fix gate action-density) |
| `npm run test` | ⊘ no ejecutado en cierre (opcional dev:agent:close) |
| `npm run db:validate` | ⊘ pendiente post-push |

---

## Decisiones

- **Clean room:** nueva composición CICA; no parchear estética legacy en `/espacio/*`.
- **Home clínico:** `EPIS2_CLINICAL_HOME` → `/app/buscar` con CICA ON.
- **Formularios nativos CICA:** evolución SOAP, receta, certificado, epicrisis; lab/interconsulta redirigen a sección hasta MF dedicada.
- **Tema:** reutiliza `Epis2ThemePreferences`; controles compactos en top bar CICA.

---

## Riesgos

- Suite E2E legacy (censo clásico) puede seguir roja en CI; specs CICA nuevas no cubren todo el golden journey.
- `/espacio/*` sigue disponible con `VITE_ENABLE_CICA_UI=false` — no hay apagado total del shell legacy.
- Tab **Alta/epicrisis** no en chart tabs; acceso vía resumen/secundaria.
- `apps/web/test-results/` excluido del commit (artefactos Playwright locales).

---

## Próximo paso exacto

1. Abrir PR `feat/prog-aesthetic-reset-close` → `master` y validar CI (E2E CICA + gates).
2. Ejecutar `npm run test` + `npm run db:validate` antes de merge.
3. MF siguiente: formularios CICA nativos lab/interconsulta; tab Alta en chart.
4. Arrancar sesión: `npm run stack:dev` · `npm run dev:session` · `@reports/dev-agent-brief.md`.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
