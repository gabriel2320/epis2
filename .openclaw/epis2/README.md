# EPIS2 OpenClaw workspace

> **Modo:** read-only microagentes de desarrollo  
> **Patrón:** adaptado desde EPIS MF-81A; agentes y gates EPIS2-native

Este directorio configura OpenClaw para EPIS2 sin permisos de escritura autónoma.

## Estructura

```text
.openclaw/epis2/
  README.md                 ← este archivo
  skills/                   ← un SKILL.md por agente reviewer
  policies/                 ← read-only + forbidden actions
```

Artefactos generados (gitignored): `.agent-runs/openclaw/` · `reports/openclaw-latest-*.md`

## Uso rápido

```powershell
npm run openclaw:brief -- --mf MF-TRAMO-J --agents security,ux,golden
npm run openclaw:handoff -- --mf MF-TRAMO-J --agents security,ux,golden
npm run openclaw:brief -- --mf auto --agents auto   # sugiere agentes por contexto
```

## Integración sesión

```powershell
npm run dev:session -- --openclaw
# Cursor: @reports/dev-agent-brief.md @reports/openclaw-latest-brief.md
```

## Documentación

- [docs/product/EPIS2_OPENCLAW_INTEGRATION.md](../../docs/product/EPIS2_OPENCLAW_INTEGRATION.md)
- [docs/product/EPIS2_OPENCLAW_SIBLING_REPO.md](../../docs/product/EPIS2_OPENCLAW_SIBLING_REPO.md) — plan repo hermano `openclaw-epis2` (migración workspace Fase 2)

## Reglas

- Read-only reviewers · brief/handoff
- No commits · no push · no `.env` · no auto-aprobación clínica
- No import EPIS sin manifest · no OpenMRS/Carbon · Home = Centro de Comando
- Cursor ejecuta cambios; humano aprueba
