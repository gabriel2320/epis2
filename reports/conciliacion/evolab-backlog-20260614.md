# F6.1 — Backlog Evolab → EPIS2 (top-15 high)

**Fecha:** 2026-06-14 · **Sync:** `reports/evolab-open-findings.json` (200 open · 142 high)  
**Regla:** triage humano; no cierre masivo. Duplicados por evolución comparten fingerprint.

| # | Fingerprint | N | Tema / escenario | Hipótesis Evolab | MF / acción EPIS2 | Prioridad |
|---|-------------|---|------------------|------------------|-------------------|-----------|
| 1 | `efa918267c3cb027` | 8 | admission-discharge mutate | hyp-c-audit-trail (audit) | Completar audit POST admit/discharge · `apps/api/src/audit/` | P1 |
| 2 | `129c4d642faf16a7` | 7 | admission-discharge mutate | — | Backlog flujo alta · golden journey admisión | P2 |
| 3 | `8aeb8c6185184187` | 5 | admission-discharge deep | hyp-a (CDR) | Revisar CDR / critical_pending — mutantes históricos FP | P2 |
| 4 | `506ef4bc80655fff` | 5 | discharge-critical-pending | hyp-a | Epicrisis / órdenes pendientes · tramo C | P2 |
| 5 | `50df1d69aac96d12` | 4 | admission-discharge RBAC | hyp-b **fixed** | Cerrar findings tras replay · MF-SH-02 evals | P1 |
| 6 | `ad10b9ca2328a548` | 4 | admission-discharge | — | Backlog admisión · eval functional | P2 |
| 7 | `573cf1a080ff62ee` | 4 | double-booking branch | hyp-d **fixed** | Triage rejected / replay base verde | P3 |
| 8 | `574d5e3ea683be74` | 4 | admission-double-booking | hyp-d **fixed** | Censo cruzado — señal histórica | P3 |
| 9 | `0bf2e44cf31856bb` | 4 | role-evolution-sign | — | Human approval / RBAC signoff · MF-SH-02 | P1 |
| 10 | `2f5e783a3139475d` | 4 | admission-discharge mutate | — | Backlog alta | P2 |
| 11 | `a512384868392eb0` | 4 | admission-discharge mutate | — | Mutación elite — revisar eval metamorphic | P2 |
| 12 | `004600c0eb603e6e` | 3 | admission-discharge deep | — | Duplicado tema #1/#2 — agrupar en sesión audit | P2 |
| 13 | `ab2c941bd9403548` | 3 | admission-discharge mutate | — | Golden journey admisión | P2 |
| 14 | `38b77515783d8518` | 3 | role-nurse-approve | — | RBAC nurse vs approve · draft.approve | P1 |
| 15 | `0fb4aaf3272dce09` | 3 | admission-double-booking | hyp-d **fixed** | FP histórico — no nuevo bug | P3 |

## Agrupación recomendada

| Bucket | Filas | Siguiente MF |
|--------|-------|--------------|
| **Audit / alta** | 1, 12 | hyp-c-audit-trail · MF-CASE-* |
| **RBAC / signoff** | 5, 9, 14 | **MF-SH-02** + replay Evolab |
| **CDR / crítico pendiente** | 3, 4 | hyp-a fixed · triage rejected |
| **Censo / double-booking** | 7, 8, 15 | hyp-d fixed · cerrar tras replay |
| **Ruido evolución** | 2, 6, 10, 11, 13 | Revisión semanal; no P0 |

## Cierre en Evolab (post-fix)

```bash
cd epis2-evolab
npm run evolab -- review --finding-id <uuid> --decision approved
# o batch tras replay verde del escenario base
```

## Referencias

- Triage F3: [`evolab-triage-2026-06-14.md`](./evolab-triage-2026-06-14.md)
- Hipótesis: `epis2-evolab/reports/evolution/hypotheses.jsonl`
