# EPIS2 — Tríada de repositorios (producto · simulador · biblioteca)

**Versión:** 1.0 · **Fecha:** 2026-06-14  
**Programa:** PROG-CONCILIACION-TRIADA-2026 · Plan: [`reports/epis2-plan-conciliacion-triada-2026-06-14.md`](../../reports/epis2-plan-conciliacion-triada-2026-06-14.md)

> **Principio:** tres repos hermanos, tres roles. Integración solo por **contratos exportados** (JSON, YAML, HTTP). Nunca import cruzado de código clínico.

---

## Repositorios

| Repo | Ruta local | GitHub | Rol |
|------|------------|--------|-----|
| **EPIS2** | `…/EPIS2` | [gabriel2320/epis2](https://github.com/gabriel2320/epis2) | Producto clínico · SoT PostgreSQL |
| **epis2-evolab** | `…/epis2-evolab` | [gabriel2320/epis2-evolab](https://github.com/gabriel2320/epis2-evolab) | Simulador · escenarios · findings |
| **EPIS2-MedRepo** | `…/EPIS2-MedRepo` | local `3e1181b` · remote pendiente | Biblioteca médica · RAG · Knowledge Packs |

**Legacy (solo lectura):** `…/Epis` — donante congelado; ver `legacy-import-manifest.json`.

---

## Diagrama de dependencias

```text
EPIS2 (master)
  ▲ HTTP sandbox 5173/3001
  │ npm run evolab:*  (bridge)
  │
epis2-evolab ──findings JSON──► reports/evolab-open-findings.json (EPIS2)
  ▲ scenario packs
  │
EPIS2-MedRepo ──knowledge-pack JSON──► EPIS2 (consumo futuro CDS)
              └──evolab-export──────► epis2-evolab
```

---

## Contratos permitidos

| Contrato | Productor | Consumidor | Prohibido |
|----------|-----------|------------|-----------|
| Sandbox HTTP | EPIS2 | Evolab Playwright | Evolab en router EPIS2 |
| `evolab-bridge.mjs` | EPIS2 scripts | spawn CLI Evolab | `import @evolab/*` en apps |
| Escenario YAML | case-intel / MedRepo | Evolab `scenarios/` | Copiar evolution-lab a EPIS2 |
| Findings sync | Evolab DB | EPIS2 `dev:evolab:sync` | Auto-fix sin humano |
| Knowledge Pack | MedRepo export | EPIS2 read-only loader | MedRepo como SoT clínico |
| clinical-case-intel | EPIS2 service | Evolab YAML | — |

---

## Variables de entorno (puente)

| Variable | Default | Repo |
|----------|---------|------|
| `EPIS2_EVOLAB_ROOT` | `../epis2-evolab` | EPIS2 |
| `EPIS2_ROOT` | (inyectado bridge) | Evolab |
| `EPIS2_EVOLAB_OPTIONAL` | — | skip bridge si falta clone |

Ver [`EPIS2_EVOLAB_INTEGRATION.md`](./EPIS2_EVOLAB_INTEGRATION.md) · MedRepo: `../EPIS2-MedRepo/docs/ARCHITECTURE.md`.

---

## Orden operativo (commit/push)

1. EPIS2 — gates PROG-DI verdes → push `master`
2. epis2-evolab — push → `evolab:smoke` contra EPIS2 nuevo
3. EPIS2-MedRepo — git init + check verde → push
4. Integración F6 — packs y triage findings

---

## Referencias

- [`EPIS2_EVOLAB_INTEGRATION.md`](./EPIS2_EVOLAB_INTEGRATION.md)
- [`EPIS2_PROG_DETERMINISTIC_INTELLIGENCE.md`](./EPIS2_PROG_DETERMINISTIC_INTELLIGENCE.md)
- [`reports/conciliacion/`](../conciliacion/) — inventarios S1+
