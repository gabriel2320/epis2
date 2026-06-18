# EPIS2 — Reportes de sesión y microfases

**No es fuente de verdad vigente por defecto.**

| Para decisiones de alcance | Documento |
|----------------------------|-----------|
| Estado ejecutivo | [`docs/EPIS2_CURRENT_STATE.md`](../docs/EPIS2_CURRENT_STATE.md) |
| Gobierno documental | [`docs/DOCUMENTATION_GOVERNANCE.md`](../docs/DOCUMENTATION_GOVERNANCE.md) |
| Tablero humano | [`docs/product/EPIS2_TABLERO.md`](../docs/product/EPIS2_TABLERO.md) |
| Ledgers MF | `docs/quality/*-ledger.json` |

---

## Qué hay aquí

- Cierres de microfases (`epis2-mf-*.md`)
- Cierres de programas (`epis2-prog-*-close*.md`)
- Auditorías puntuales (`epis2-*-audit*.md`)
- Briefs de agentes (`dev-agent-brief.md`, `dev-agent-prompt-*.md`)

Convención de nombre: `epis2-<tema>-<YYYY-MM-DD>.md` o `epis2-mf-<id>-<slug>.md`.

---

## Archivo

Reportes históricos se mueven a **`reports/archive/YYYY-MM/`** sin borrar evidencia.

Reglas: [`docs/DOCUMENTATION_GOVERNANCE.md`](../docs/DOCUMENTATION_GOVERNANCE.md)

Archivo inicial: [`archive/2026-06/README.md`](archive/2026-06/README.md) — lotes 1–12 (547+ archivos) en `archive/2026-06/`.

---

## Reportes útiles (punto de entrada)

| Tema | Archivo |
|------|---------|
| Consolidación ola 1 | `archive/2026-06/epis2-prog-consolidate-close-2026.md` |
| Ficha-first cierre | `archive/2026-06/epis2-prog-ficha-first-close-2026.md` |
| Plan unificado | `archive/2026-06/epis2-plan-desarrollo-unificado-2026-06-14.md` |
| Rate limit Redis | `archive/2026-06/epis2-mf-con-07-rate-limit.md` |

---

## Para agentes Cursor

En arranque de sesión, adjuntar solo lo indicado en `npm run dev:session` (brief + prompt subagente). **No** indexar todo `reports/` como canon.
