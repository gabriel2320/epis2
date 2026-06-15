# EPIS2 — Plan F completo (signoff piloto demo)

**Fecha:** 2026-06-05  
**Estado:** cerrado para piloto demo · producción parcial

## Alcance cumplido

| Track | Gate | Estado |
|-------|------|--------|
| V4 interop | `golden-v4-interop-ops` en CI | ✓ |
| V4 ops | `db:backup`, ops/hardening | ✓ |
| V5 IA | `golden-v5-ai-traceable`, `ai:evals` | ✓ |
| V5 NL | `POST /api/commands/suggest` | ✓ |
| Hardening | Rate limits, RLS 022 + transacciones clínicas | ✓ |
| Hardening | `AUTH_MODE=hybrid` + service key (ADR-006 piloto) | ✓ |

## Slices

| Slice | Commit | Reporte |
|-------|--------|---------|
| 1 | `fa130f7` | `epis2-plan-f-slice.md` |
| 2 | `4a911d2` | `epis2-plan-f-slice-2.md` |
| 3 | `1a1f81a` | `epis2-plan-f-slice-3.md` |

## Gates verificados

```bash
npm run check
npm run test
npm run db:validate
npm run ai:evals
npm run quality:golden-journey   # V0–V5 API + spec
```

## Fuera de alcance (post-piloto)

| Ítem | ADR / nota |
|------|------------|
| OIDC producción | ADR-006 completo |
| RLS en dashboard/IA | Solo SoT clínico cableado |
| HL7 inbound write | Piloto read-only |
| Métricas/tracing | Ops status mínimo |

## Riesgos aceptados (demo)

- `RLS_MODE=off` por defecto — enforce opt-in.
- Service key ≠ auth enterprise; solo integraciones piloto.
- Ollama off: journeys y evals sintéticos pasan; IA live opcional.

## Próximo

**Plan G** cerrado en paralelo · roadmap post-MVP según `EPIS2_RELEASE_ROADMAP.md`.
