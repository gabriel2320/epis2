# A3 — Revisión seguridad MCP (pre-push)

**Fecha:** 2026-06-14 · **Alcance:** `.cursor/mcp.json` commit `d349a63`  
**Plan:** [`epis2-plan-correcciones-prioritarias-2026-06-14.md`](../epis2-plan-correcciones-prioritarias-2026-06-14.md) · Bloque A

---

## Servidores configurados

| MCP | Riesgo | Veredicto |
|-----|--------|-----------|
| **github** | Token en env; scopes amplios | ✓ Aceptable — PAT vía `GITHUB_PERSONAL_ACCESS_TOKEN`; no hardcode |
| **figma-desktop** | Localhost only | ✓ Bajo — diseño, sin PHI |
| **context7** | Docs técnicas externas | ✓ Bajo — no toca SoT |
| **playwright** | Automatización browser | ✓ Aceptable — solo demo local; no sustituye gates E2E |
| **postgres-readonly** | Lectura DB clínica | ⚠️ **Condicional** — ver abajo |

---

## Postgres MCP — checklist

| # | Control | Estado |
|---|---------|--------|
| 1 | URL separada de app (`EPIS2_MCP_DATABASE_URL` ≠ `DATABASE_URL`) | ✓ Documentado en `CURSOR_PLUGINS_EPIS2.md` |
| 2 | Rol dedicado `epis2_mcp_ro` solo SELECT | ✓ Migración `045_epis2_mcp_ro.sql` |
| 3 | RLS activo (`NOBYPASSRLS`) | ✓ Por diseño migración |
| 4 | Solo datos sintéticos DEMO en dev | ✓ Invariante canon #10 |
| 5 | `.env` no commiteado | ✓ Verificar local |
| 6 | No usar en staging/prod con PHI real | ✓ Política documentada |
| 7 | Prompts sin pegar PHI | ✓ Regla en CURSOR_PLUGINS |

**Veredicto postgres-readonly:** **APROBADO para push** con uso restringido a dev local sintético. En entornos con PHI real: **desactivar** MCP postgres en `.cursor/mcp.json` local.

---

## Acciones obligatorias antes de usar MCP DB

```bash
npm run stack:up
npm run db:migrate          # incluye 045
npm run cursor:verify
```

---

## Prohibido

- Pegar RUT, nombres reales o payloads clínicos en prompts MCP.
- Apuntar `EPIS2_MCP_DATABASE_URL` a producción.
- Conectar PostHog/Sentry MCP con eventos clínicos (no configurados — correcto).

---

## Gate A3

| Criterio | Resultado |
|----------|-----------|
| Checklist completado | ✓ |
| Documentación alineada | ✓ `CURSOR_PLUGINS_EPIS2.md` |
| Bloqueo push | No — riesgo mitigado en dev |

**Siguiente:** A1 push `master` (aprobación humana) · A2 tablero sync.
