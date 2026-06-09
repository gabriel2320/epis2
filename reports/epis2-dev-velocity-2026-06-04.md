# EPIS2 — Velocidad de desarrollo (implementación)

**Fecha:** 2026-06-04  
**Alcance:** docs + scripts + hooks Cursor + npm scripts

---

## Entregado

| Artefacto | Rol |
|-----------|-----|
| `docs/dev/EPIS2_DEV_VELOCITY.md` | Guía operativa loop diario |
| `npm run dev:velocity` | Arranque tablero + brief |
| `npm run dev:velocity:gates` | Gates por subagente/tramo |
| `npm run dev:install-hooks` | Pre-push local → `check` |
| `.cursor/hooks.json` + `session-start.mjs` | Recordatorio al abrir sesión Cursor |
| `.cursor/skills/epis2-velocity` | Skill agente |
| `/epis2-velocity` | Comando slash |

---

## Gates sesión

| Gate | Resultado |
|------|-----------|
| `npm run dev:velocity` | OK |
| `npm run check` | OK |

---

## Uso inmediato

```bash
npm run dev:velocity
npm run dev:install-hooks    # opcional, una vez
```

Pre-PR: `EPIS2_LOCAL_CI_E2E=1 npm run quality:local-ci`

---

## Riesgos

- Hook `sessionStart`: Cursor puede no inyectar `additional_context` (bug conocido) — usar `/epis2-session` como respaldo.
- `dev:velocity:gates` con golden-journey puede ser lento — reservar pre-PR.

---

## Próximo paso

P1 producto: Hilo D Tramo J con `npm run dev:velocity -- --tramo J --refresh`.
